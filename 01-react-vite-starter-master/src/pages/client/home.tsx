import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Divider, Form, InputNumber, Pagination, Rate, Row, Tabs } from "antd";
import '@/styles/homepages.scss'

const HomePage = () => {
    const [form] = Form.useForm();


    const items = [
        {
            key: '1',
            label: 'Pho bien',
            children: <></>,
        },
        {
            key: '2',
            label: 'Noi bat',
            children: <></>,
        }
    ]

    return (
        <>
            <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto ' }}>
                <Row gutter={[20, 20]}>
                    <Col md={4} sm={0} xs={0} style={{ border: "1px solid green" }}>
                        <div style={{ display: 'flex', justifyContent: "space-between" }}>
                            <span><FilterTwoTone />Bộ lọc tìm kiếm</span>
                            <ReloadOutlined title="Reset" onClick={() => form.resetFields()} />
                        </div>
                        <Form
                            // onFinish={onFinish}
                            form={form}
                            onValuesChange={(changedValues, values) => handleChangeFilter()}
                        >
                            <Form.Item
                                name="category"
                                label="Danh mục sản phẩm"
                                labelCol={{ span: 24 }}
                            >
                                <Checkbox.Group>
                                    <Row>
                                        <Col span={24}>
                                            <Checkbox value="A">
                                                A
                                            </Checkbox>
                                        </Col>
                                        <Col span={24}>
                                            <Checkbox value="B">
                                                B
                                            </Checkbox>
                                        </Col>
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>
                            <Divider />
                            <Form.Item
                                label="Khoảng giá"
                                labelCol={{ span: 24 }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Form.Item name={["range", 'from']}>
                                        <InputNumber
                                            name='from'
                                            min={0}
                                            placeholder="vnd Từ"
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        />
                                    </Form.Item>
                                    <span>-</span>
                                    <Form.Item name={["range", 'to']}>
                                        <InputNumber
                                            name='to'
                                            min={0}
                                            placeholder="vnd Đến"
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        />
                                    </Form.Item>
                                </div>
                                <div>
                                    <Button onClick={() => form.submit()}
                                        style={{ width: "100%" }} type="primary">Áp dụng</Button>
                                </div>
                            </Form.Item>
                            <Divider />
                            <Form.Item
                                label="Đánh giá"
                                labelCol={{ span: 24 }}
                            >
                                <div>
                                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                    <span className="ant-rate-text"></span>
                                </div>
                                <div>
                                    <Rate value={4} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                    <span className="ant-rate-text">trở lên</span>
                                </div>
                                <div>
                                    <Rate value={3} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                    <span className="ant-rate-text">trở lên</span>
                                </div>
                                <div>
                                    <Rate value={2} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                    <span className="ant-rate-text">trở lên</span>
                                </div>
                                <div>
                                    <Rate value={1} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                    <span className="ant-rate-text">trở lên</span>
                                </div>
                            </Form.Item>
                        </Form>
                    </Col>

                    <Col md={20} sm={24} style={{ border: "1px solid red" }}>
                        <Row>
                            <Tabs
                                defaultActiveKey="1"
                                items={items}
                            // onChange={onChange}
                            />
                        </Row>
                        <Row className="customize-row">
                            <div className="column">
                                <div className="wrapper">
                                    <div className="thumbnail">
                                        <img src="http://localhost:8080/images/book/1-5e81d7f66dada42752efb220d7b2956c.jpg" />
                                    </div>
                                    <div className="text">Tu Duy ve Tien Bac</div>
                                    <div className="price">
                                        {new Intl.NumberFormat(
                                            'vi-VN',
                                            { style: 'currency', currency: 'VND' }
                                        ).format(100000)}
                                    </div>
                                    <div className="rating">
                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                        <span>Đã bán 1k</span>
                                    </div>
                                </div>
                            </div>
                            <div className="column">
                                <div className="wrapper">
                                    <div className="thumbnail">
                                        <img src="http://localhost:8080/images/book/1-5e81d7f66dada42752efb220d7b2956c.jpg" />
                                    </div>
                                    <div className="text">Tu Duy ve Tien Bac</div>
                                    <div className="price">
                                        {new Intl.NumberFormat(
                                            'vi-VN',
                                            { style: 'currency', currency: 'VND' }
                                        ).format(100000)}
                                    </div>
                                    <div className="rating">
                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                        <span>Đã bán 1k</span>
                                    </div>
                                </div>
                            </div>
                            <div className="column">
                                <div className="wrapper">
                                    <div className="thumbnail">
                                        <img src="http://localhost:8080/images/book/1-5e81d7f66dada42752efb220d7b2956c.jpg" />
                                    </div>
                                    <div className="text">Tu Duy ve Tien Bac</div>
                                    <div className="price">
                                        {new Intl.NumberFormat(
                                            'vi-VN',
                                            { style: 'currency', currency: 'VND' }
                                        ).format(100000)}
                                    </div>
                                    <div className="rating">
                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                        <span>Đã bán 1k</span>
                                    </div>
                                </div>
                            </div>
                        </Row>
                        <Divider />
                        <Row style={{ display: "flex", justifyContent: "center" }}>
                            <Pagination
                                defaultCurrent={6}
                                total={500}
                                responsive
                            />
                        </Row>

                    </Col>
                </Row>
            </div>
        </>
    );
};

export default HomePage;