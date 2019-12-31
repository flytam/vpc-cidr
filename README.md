## 私有网络 ipv4 cidr 设置数据层

> 可用于新建私有网络时的初始化ipv4 cidr合法输入设置

#### Usage
```ts
import {Ipv4CidrModel} from 'vpc-cidr'
// 更多用法参考 测试样例
const model = new Ipv4CidrModel([
    '10.0.0.0/8',
    '172.16.0.0/12',
    '192.168.0.0/16'
  ])

```

#### API

- `updateIndexIp(index: number,ipValue: number,force?: /**force表示跳过检测强制设置，例如设置首位的时候 */ boolean)`更新第x位ip的值，返回经过校验的十进制cidr值

- `updateMask(number: number):[number,number,number,number] ` 更新掩码，返回经过校验的十进制cidr值

- `getOriginValue():[number,number,number,number]` 获取十进制cidr值。如`[192,168,0,0,16]`

- `getRange():range: { '0': number[],'1': number[],'2': number[],'3': number[] } `。获取每个ip位上的值的可设置值

#### Test
```bash
npm run test
```