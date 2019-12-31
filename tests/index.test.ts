import { Ipv4CidrModel } from "../src/index";

console.log = () => {};

const initModel = () =>
    new Ipv4CidrModel(["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"]);

// 对cidr-model进行单元测试
describe("掩码范围", () => {
    let model: Ipv4CidrModel = null;
    beforeEach(() => {
        model = initModel();
    });

    test("掩码位默认16-28", () => {
        expect(model.getMaskOptions()).toStrictEqual(
            genArr({
                begin: 16,
                end: 28
            })
        );
    });
});

describe("10网段 ip范围", () => {
    let model: Ipv4CidrModel = null;
    beforeEach(() => {
        model = initModel();
        model.updateIndexIp(0, 10, true);
    });
    test("掩码16", () => {
        model.updateMask(16);
        const range = model.getRange();
        expect(range[0]).toStrictEqual([10]);
        expect(range[1]).toStrictEqual(genArr());
        expect(range[2]).toStrictEqual([0]);
        expect(range[3]).toStrictEqual([0]);
    });
    test("掩码17", () => {
        model.updateMask(17);
        const range = model.getRange();
        expect(range[1]).toStrictEqual(genArr());
        expect(range[2]).toStrictEqual([0, 128]);
        expect(range[3]).toStrictEqual([0]);
    });
    test("掩码19", () => {
        model.updateMask(19);
        const range = model.getRange();
        expect(range[1]).toStrictEqual(genArr());
        expect(range[2]).toStrictEqual(genArr({ divide: 32 }));
        expect(range[3]).toStrictEqual([0]);
    });

    test("掩码22", () => {
        model.updateMask(22);
        const range = model.getRange();
        expect(range[1]).toStrictEqual(genArr());
        expect(range[2]).toStrictEqual(genArr({ divide: 4 }));
        expect(range[3]).toStrictEqual([0]);
    });

    test("掩码24", () => {
        model.updateMask(24);
        const range = model.getRange();
        expect(range[1]).toStrictEqual(genArr());
        expect(range[2]).toStrictEqual(genArr());
        expect(range[3]).toStrictEqual([0]);
    });

    test("掩码25", () => {
        model.updateMask(25);
        const range = model.getRange();
        expect(range[1]).toStrictEqual(genArr());
        expect(range[2]).toStrictEqual(genArr());
        expect(range[3]).toStrictEqual(genArr({ divide: 128 }));
    });

    test("掩码27", () => {
        model.updateMask(27);
        const range = model.getRange();
        expect(range[1]).toStrictEqual(genArr());
        expect(range[2]).toStrictEqual(genArr());
        expect(range[3]).toStrictEqual(genArr({ divide: 32 }));
    });

    test("掩码28", () => {
        model.updateMask(28);
        const range = model.getRange();
        expect(range[1]).toStrictEqual(genArr());
        expect(range[2]).toStrictEqual(genArr());
        expect(range[3]).toStrictEqual(genArr({ divide: 16 }));
    });
});

describe("172网段 ip范围", () => {
    let model: Ipv4CidrModel = null;
    beforeEach(() => {
        model = initModel();
        model.updateIndexIp(0, 172, true);
    });
    test("掩码16", () => {
        model.updateMask(16);
        const range = model.getRange();
        expect(range[0]).toStrictEqual([172]);
        expect(range[1]).toStrictEqual(genArr({ begin: 16, end: 31 }));
        expect(range[2]).toStrictEqual([0]);
        expect(range[3]).toStrictEqual([0]);
    });
    test("掩码17", () => {
        model.updateMask(17);
        const range = model.getRange();
        expect(range[1]).toStrictEqual(genArr({ begin: 16, end: 31 }));
        expect(range[2]).toStrictEqual([0, 128]);
        expect(range[3]).toStrictEqual([0]);
    });
    test("掩码19", () => {
        model.updateMask(19);
        const range = model.getRange();
        expect(range[1]).toStrictEqual(genArr({ begin: 16, end: 31 }));
        expect(range[2]).toStrictEqual(genArr({ divide: 32 }));
        expect(range[3]).toStrictEqual([0]);
    });

    test("掩码22", () => {
        model.updateMask(22);
        const range = model.getRange();
        expect(range[1]).toStrictEqual(genArr({ begin: 16, end: 31 }));
        expect(range[2]).toStrictEqual(genArr({ divide: 4 }));
        expect(range[3]).toStrictEqual([0]);
    });

    test("掩码24", () => {
        model.updateMask(24);
        const range = model.getRange();
        expect(range[1]).toStrictEqual(genArr({ begin: 16, end: 31 }));
        expect(range[2]).toStrictEqual(genArr());
        expect(range[3]).toStrictEqual([0]);
    });

    test("掩码25", () => {
        model.updateMask(25);
        const range = model.getRange();
        expect(range[1]).toStrictEqual(genArr({ begin: 16, end: 31 }));
        expect(range[2]).toStrictEqual(genArr());
        expect(range[3]).toStrictEqual(genArr({ divide: 128 }));
    });

    test("掩码27", () => {
        model.updateMask(27);
        const range = model.getRange();
        expect(range[1]).toStrictEqual(genArr({ begin: 16, end: 31 }));
        expect(range[2]).toStrictEqual(genArr());
        expect(range[3]).toStrictEqual(genArr({ divide: 32 }));
    });

    test("掩码28", () => {
        model.updateMask(28);
        const range = model.getRange();
        expect(range[1]).toStrictEqual(genArr({ begin: 16, end: 31 }));
        expect(range[2]).toStrictEqual(genArr());
        expect(range[3]).toStrictEqual(genArr({ divide: 16 }));
    });
});

describe("192网段 ip范围", () => {
    let model: Ipv4CidrModel = null;
    beforeEach(() => {
        model = initModel();
        model.updateIndexIp(0, 192, true);
    });
    test("掩码16", () => {
        model.updateMask(16);
        const range = model.getRange();
        expect(range[0]).toStrictEqual([192]);
        expect(range[1]).toStrictEqual([168]);
        expect(range[2]).toStrictEqual([0]);
        expect(range[3]).toStrictEqual([0]);
    });
    test("掩码17", () => {
        model.updateMask(17);
        const range = model.getRange();
        expect(range[1]).toStrictEqual([168]);
        expect(range[2]).toStrictEqual([0, 128]);
        expect(range[3]).toStrictEqual([0]);
    });
    test("掩码19", () => {
        model.updateMask(19);
        const range = model.getRange();
        expect(range[1]).toStrictEqual([168]);
        expect(range[2]).toStrictEqual(genArr({ divide: 32 }));
        expect(range[3]).toStrictEqual([0]);
    });

    test("掩码22", () => {
        model.updateMask(22);
        const range = model.getRange();
        expect(range[1]).toStrictEqual([168]);
        expect(range[2]).toStrictEqual(genArr({ divide: 4 }));
        expect(range[3]).toStrictEqual([0]);
    });

    test("掩码24", () => {
        model.updateMask(24);
        const range = model.getRange();
        expect(range[1]).toStrictEqual([168]);
        expect(range[2]).toStrictEqual(genArr());
        expect(range[3]).toStrictEqual([0]);
    });

    test("掩码25", () => {
        model.updateMask(25);
        const range = model.getRange();
        expect(range[1]).toStrictEqual([168]);
        expect(range[2]).toStrictEqual(genArr());
        expect(range[3]).toStrictEqual(genArr({ divide: 128 }));
    });

    test("掩码27", () => {
        model.updateMask(27);
        const range = model.getRange();
        expect(range[1]).toStrictEqual([168]);
        expect(range[2]).toStrictEqual(genArr());
        expect(range[3]).toStrictEqual(genArr({ divide: 32 }));
    });

    test("掩码28", () => {
        model.updateMask(28);
        const range = model.getRange();
        expect(range[1]).toStrictEqual([168]);
        expect(range[2]).toStrictEqual(genArr());
        expect(range[3]).toStrictEqual(genArr({ divide: 16 }));
    });
});

describe("设置测试", () => {
    let model: Ipv4CidrModel = null;
    // 主要测试某位不符合规则时是否自动设置
    beforeEach(() => {
        model = initModel();
    });

    test("设置测试  ", () => {
        model.updateIndexIp(0, 10, true);
        model.updateMask(17);
        expect(model.getOriginValue()).toStrictEqual([10, 0, 0, 0, 17]);
        // -> 10.0.0.0/17
        let result = model.updateIndexIp(2, 64);
        expect(result).toStrictEqual([10, 0, 128, 0, 17]);

        result = model.updateIndexIp(1, 64);
        expect(result).toStrictEqual([10, 64, 128, 0, 17]);

        result = model.updateMask(16);
        expect(result).toStrictEqual([10, 64, 0, 0, 16]);

        result = model.updateIndexIp(1, 222);
        expect(result).toStrictEqual([10, 222, 0, 0, 16]);

        result = model.updateIndexIp(0, 192, true);
        expect(result).toStrictEqual([192, 168, 0, 0, 16]);

        result = model.updateIndexIp(0, 172, true);
        expect(result).toStrictEqual([172, 31, 0, 0, 16]);
    });
});

// 测试专用工具函数
/**
 * 生成一个数组
 */
function genArr(params?: {
    /**
     * 数组开始的值 默认是0
     */
    begin?: number;
    /**
     * 数组间隔 默认是 1
     */
    divide?: number;
    /**
     * 数字上限 默认255
     */
    end?: number;
}): number[] {
    const { end = 255, divide = 1, begin = 0 } = params || {};
    const result: number[] = [];

    let tmp = begin;
    while (tmp <= end) {
        result.push(tmp);
        tmp += divide;
    }
    return result;
}
