import { Button, Checkbox, Col, Divider, Drawer, Form, InputNumber, Rate, Row } from "antd";

interface IProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    handleChangeFilter: any;
    listCategory: { label: string; value: string }[];
    onFinish: any;
}

const MobileFilter = (props: IProps) => {
    const {
        isOpen, setIsOpen,
        handleChangeFilter,
        listCategory, onFinish
    } = props

    const [form] = Form.useForm();

    return (
        <Drawer
            title="Lọc sản phẩm"
            placement="right"
            onClose={() => setIsOpen(false)}
            open={isOpen}
        >
            <Form
                onFinish={onFinish}
                form={form}
                onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
            >
                <Form.Item
                    name="category"
                    label="Danh mục sản phẩm"
                    labelCol={{ span: 24 }}
                >
                    <Checkbox.Group>
                        <Row>
                            {listCategory?.map((item, index) => {
                                return (
                                    <Col span={24} key={`index-${index}`} >
                                        <Checkbox value={item.label}>
                                            {item.label}
                                        </Checkbox>
                                    </Col>
                                )
                            })}
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
        </Drawer>
    )

}

export default MobileFilter;