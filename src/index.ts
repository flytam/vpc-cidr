export type TBin = 1 | 0;
/**
 * 10.0.0.0/8
 * 172.16.0.0/12
 * 192.168.0.0/16
 */
export type TVpcCidrConfig = string[];
// 更新第几位的ip 类型
export type TIndex = 0 | 1 | 2 | 3; // | '0' | '1' | '2' | '3'

export class Ipv4CidrModel {
    // 32长度 为数组
    private _binIp: TBin[];
    // 格式化字符串 cidr网段后存储
    private _map: {
        [first: string /**ip第0段10进制 */]: {
            "0": number;
            "1": number;
            "2": number;
            "3": number;
            /**这个mask 是限制的 */
            limitMask: number;
        };
    };

    // 掩码范围
    private maskOptions: number[];

    // 当前掩码。可写的
    private mask: number;

    constructor(
        param: TVpcCidrConfig,
        maskOptions: number[] = [...Array(28)]
            .map((_, index) => index + 1)
            .filter(item => item >= 16)
    ) {
        this._map = {};
        this._binIp = [];
        this.maskOptions = maskOptions;
        if (!this.hasInit) {
            this._init(param);
            this.hasInit = true;
        }
    }

    /**
     * 初始化
     */
    private _init(param: TVpcCidrConfig) {
        for (let cidr of param) {
            const [ipStr, mask] = cidr.split("/");

            const ipArr = ipStr.split(".");

            this._map[String(ipArr[0])] = {
                limitMask: Number(mask),
                ...ipArr.reduce(
                    (map, item, index) => {
                        map[index] = item;
                        return map;
                    },
                    {} as {
                        0: number;
                        1: number;
                        2: number;
                        3: number;
                    }
                )
            };
        }
        // 初始默认值
        const [ip, mask] = param[0].split("/");
        this.mask = this.maskOptions[0];
        ip.split(".").forEach((item, index) => {
            this._numberToBinStr(Number(item))
                .split("")
                .forEach(
                    (b, i) => (this._binIp[index * 8 + i] = Number(b) as TBin)
                );
        });
    }

    public hasInit = false;

    /**
     * 校验 是否合法
     * 返回值表示该位的合法值。合法时就是本身。可以设置force跳过检验
     */
    private _check({
        mask,
        ip,
        force = false
    }: {
        mask?: number;
        ip?: {
            index: number;
            value: number;
        };
        force?: boolean;
    }) {
        const range = this.getRange();

        if (mask) {
            return mask;
        } else if (ip) {
            if (force) {
                return ip.value;
            } else {
                return this._getNearNumber(ip.value, range[ip.index]);
            }
        }
    }

    //-------对外暴露分割线-----
    /**
     * 更新掩码
     * 掩码是可以直接修改的，修完了去校验ip是否合法并更新
     * 返回更新后的完整结果字符串
     */
    public updateMask(number: number) {
        // mask值在16-28
        this.mask = this._check({ mask: number });

        // 获取新的范围
        const newRange = this.getRange();
        const ip4Item = this._getIp4ItemArr();

        ip4Item.forEach((item, index) => {
            this._numberToBinStr(
                Number(this._getNearNumber(item, newRange[index]))
            )
                .split("")
                .forEach(
                    (b, i) => (this._binIp[index * 8 + i] = Number(b) as TBin)
                );
        });

        return this.getOriginValue();
    }

    /**
     * 更新ip 那一位的值
     * 例如 尝试将 10.0.0.0/28  -> 10.0.0.22/28
     * updateIndexIp(3,22)
     * 返回更新后的完整结果字符串
     */
    public updateIndexIp(
        index: TIndex,
        ipValue: number,
        force?: /**force表示跳过检测强制设置 */ boolean
    ) {
        const result = this._check({
            ip: {
                index,
                value: ipValue
            },
            force
        });

        this._numberToBinStr(result)
            .split("")
            .forEach((item, i) => {
                this._binIp[index * 8 + i] = Number(item) as TBin;
            });
        // 检查其余位
        const range = this.getRange();
        const originValue = this.getOriginValue();
        [1, 2, 3].forEach(_index => {
            if (
                _index !== index &&
                !range[_index].includes(originValue[_index])
            ) {
                this.updateIndexIp(
                    _index as TIndex,
                    this._getNearNumber(originValue[_index], range[_index])
                );
            }
        });
        return this.getOriginValue();
    }

    /**
     * 获取每一个框的值范围
     * 范围只和私有网段的掩码 、当前选择掩码、私有网段ip有关
     */
    public getRange() {
        const range: {
            "0": number[];
            "1": number[];
            "2": number[];
            "3": number[];
        } = {
            "0": [],
            "1": [],
            "2": [],
            "3": []
        };
        const getPerIpRange = (index: /* 第几位ip*/ TIndex) => {
            if (index > 3) {
                return;
            }

            const currentIpCidrConfig = this._map[
                this._binStrToNumber(this._binIp.slice(0, 8).join(""))
            ];

            // 当前ip位剩余的mask
            // 当前位限制的位数，从高位开始，[0,restLimitMask]
            const restLimitMask = currentIpCidrConfig.limitMask - index * 8; // restLimitMask<0 表示当前ip位不受limitMask限制

            // 当前位可写的位数，从左开始 [0,restMask]
            const restMask = this.mask - index * 8; // restMask < 0 表示当前位不可编辑，由网段该位下限决定

            // 由网段该位下限决定的情况，不可写的
            if (
                restMask - restLimitMask <= 0 ||
                restMask <= 0 ||
                restLimitMask >= 8
            ) {
                // 返回该位cidr ip的值
                range[index] = [Number(currentIpCidrConfig[index])];
                return;
            }

            range[index].push(
                ...[
                    ...Array(
                        1 <<
                            (Math.min(8, restMask) - Math.max(0, restLimitMask))
                    )
                ]
                    .map(
                        (_, _index) =>
                            Number(currentIpCidrConfig[index]) +
                            (_index << (8 - Math.min(8, restMask)))
                    )
                    .filter(v => v >= Number(currentIpCidrConfig[index]))
            );
        };
        getPerIpRange(0);
        getPerIpRange(1);
        getPerIpRange(2);
        getPerIpRange(3);
        return range;
    }
    /**
     * 获取值 返回格式化后的cidr，如 10.0.0.22/28
     */
    public getFormatValue() {
        return `${this._getIp4ItemArr().join(".")}/${this.mask}`;
    }

    public getMaskOptions() {
        return this.maskOptions;
    }

    /**
     * 返回原始十进制数据  数组 [0,1,2,3,mask]
     */
    public getOriginValue() {
        return [...this._getIp4ItemArr(), this.mask];
    }
    //---------工具方法分割线-------------
    /**
     * 2进制字符串->10进制数字
     */
    private _binStrToNumber(bin: string) {
        let result = 0;
        bin.split("")
            .reverse()
            .forEach((item, index) => (result += Number(item) << index));
        return result;
    }
    /**
     * 10进制数字->8位2进制字符串
     */
    private _numberToBinStr(number: number) {
        return number.toString(2).padStart(8, "0");
    }
    /**
     * 获取一个数字在数字数组中最接近的值
     */
    static _getNearNumber(number: number, arr: number[]) {
        //
        const copyArr = [...arr];
        copyArr.sort((a, b) => a - b);
        return copyArr.find(
            (item, index) => copyArr[index + 1] === undefined || number <= item
        );
    }
    _getNearNumber = Ipv4CidrModel._getNearNumber;
    /**
     * 获取当前ip 十进制组成的数组
     */
    private _getIp4ItemArr() {
        const binIp = this._binIp;
        const tmp: number[] = [];
        for (let i = 0; i < 32; i += 8) {
            const index = Math.floor(i / 8);
            tmp[index] = this._binStrToNumber(binIp.slice(i, i + 8).join(""));
        }
        return tmp;
    }
}
