import { getDashBoardAPI } from "@/services/api";
import { Card, Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react";
import CountUp from "react-countup";


const AdminDashboard = () => {
    const [dataDashboard, setDataDashboard] = useState<IDashBoard>({
        countOrder: 0,
        countUser: 0,
        countBook: 0,
    })

    useEffect(() => {
        const initDashboard = async () => {
            const res = await getDashBoardAPI();
            if (res && res.data) setDataDashboard(res.data);
        }
        initDashboard();
    }, []);

    const formatter = (value: any) => <CountUp end={value} separator="," />
    return (
        <Row gutter={[40, 40]}>
            <Col span={8}>
                <Card title="" bordered={false}>
                    <Statistic
                        title="Tổng Users"
                        value={dataDashboard.countUser}
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card title="" bordered={false}>
                    <Statistic
                        title="Tổng Books"
                        value={dataDashboard.countBook}
                        formatter={formatter}
                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card title="" bordered={false}>
                    <Statistic
                        title="Tổng Orders"
                        value={dataDashboard.countOrder}
                        formatter={formatter}
                    />
                </Card>
            </Col>
        </Row>
    )
}

export default AdminDashboard;