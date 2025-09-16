import React from 'react';
import { Layout, Menu, Checkbox, InputNumber, Button, Row, Col, Card, Rate, GetProp, CheckboxOptionType, Divider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Meta } = Card;

const HomePage = () => {

    const options: CheckboxOptionType<string>[] = [
        { label: 'Apple', value: 'Apple' },
        { label: 'Pear', value: 'Pear' },
        { label: 'Orange', value: 'Orange' },
    ];

    const onChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
        console.log('checked = ', checkedValues);
    };

    const productData = [
        {
            title: "Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn",
            price: 70000,
            rating: 4.5,
            imageUrl: `${import.meta.env.VITE_BACKEND_URL}/images/book/1-5e81d7f66dada42752efb220d7b2956c.jpg}`, // Replace with your actual image URLs
            sold: "1k"
        },
        {
            title: "Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn",
            price: 70000,
            rating: 4,
            imageUrl: "url_to_your_image_2.jpg",
            sold: "1k"
        },
        {
            title: "Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn",
            price: 70000,
            rating: 5,
            imageUrl: "url_to_your_image_3.jpg",
            sold: "1k"
        },
        {
            title: "Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn",
            price: 70000,
            rating: 3.5,
            imageUrl: "url_to_your_image_4.jpg",
            sold: "1k"
        },
        {
            title: "Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn",
            price: 70000,
            rating: 4,
            imageUrl: "url_to_your_image_5.jpg",
            sold: "1k"
        },
        {
            title: "Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn",
            price: 70000,
            rating: 4.5,
            imageUrl: "url_to_your_image_6.jpg",
            sold: "1k"
        },
    ];

    return (
        <Layout className="site-layout-background" style={{ padding: '24px 0', backgroundColor: '#fff' }}>
            <Sider width={200} className="site-layout-background" style={{ backgroundColor: '#fff' }}>

                <Checkbox.Group options={options} defaultValue={['Pear']} onChange={onChange} />
                <Divider />
            </Sider>

            <Layout style={{ padding: '0 24px 24px', backgroundColor: '#fff' }}>
                <Header style={{ backgroundColor: '#fff', padding: 0 }}>
                    <Menu mode="horizontal" defaultSelectedKeys={['1']}>
                        <Menu.Item key="1">Phổ biến</Menu.Item>
                        <Menu.Item key="2">Hàng Mới</Menu.Item>
                        <Menu.Item key="3">Giá Thấp Đến Cao</Menu.Item>
                        <Menu.Item key="4">Giá Cao Đến Thấp</Menu.Item>
                    </Menu>
                </Header>
                <Content
                    className="site-layout-background"
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                    }}
                >
                    <Row gutter={[16, 24]}>
                        {productData.map((product, index) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={index}>
                                <Card
                                    hoverable
                                    style={{ width: 240 }}
                                    cover={<img alt={product.title} src={product.imageUrl} />}
                                >
                                    <Meta title={product.title} />
                                    <p>{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                    <Rate disabled defaultValue={product.rating} />
                                    <p>Đã bán {product.sold}</p>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Content>
            </Layout>
        </Layout>
    );
};

export default HomePage;