import { Flex, Typography } from "antd";

export default function Footer(){
    return (
    <Flex align="center" className="pb-3" justify="center">
        <Typography.Text type="secondary" className="text-black" style={{fontSize:11}}>Developed by Shaylan Group & GRSofts</Typography.Text>
    </Flex>
    );
}