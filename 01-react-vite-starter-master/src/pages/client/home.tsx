import { FilterTwoTone, MobileFilled, ReloadOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Divider, Form, FormProps, InputNumber, Pagination, Rate, Row, Spin, Tabs } from "antd";
import '@/styles/home.scss'
import { useEffect, useState } from "react";
import { getBookCategoryAPI, getBooksAPI } from "@/services/api";
import { useNavigate, useOutletContext } from "react-router-dom";
import MobileFilter from "@/components/client/book/mobile.filter";

type FieldType = {
    range: {
        from: number;
        to: number;
    }
    category: string[]
}

const HomePage = () => {
    const [searchTerm] = useOutletContext() as any;

    const [form] = Form.useForm();
    const navigate = useNavigate();

    const [listCategory, setListCategory] = useState<{ label: string, value: string }[]>([]);
    const [listBook, setListBook] = useState<IBookTable[]>([]);

    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [total, setTotal] = useState<number>(0);

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [filter, setFilter] = useState<string>("")
    const [sortQuery, setSortQuery] = useState<string>("sort=-sold");

    const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false)

    useEffect(() => {
        fetchBookCategory();
    }, [])

    const fetchBookCategory = async () => {
        const res = await getBookCategoryAPI();
        if (res && res.data) {
            const d = res.data.map(item => {
                return { label: item, value: item }
            })
            setListCategory(d)
        }
    }

    useEffect(() => {
        fetchBook();
    }, [current, pageSize, filter, sortQuery, searchTerm])

    const fetchBook = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        if (searchTerm) {
            query += `&mainText=/${searchTerm}/i`;
        }

        const res = await getBooksAPI(query);
        if (res && res.data) {
            setListBook(res.data.result);
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }

    const handleOnChangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }
    }

    const handleChangeFilter = (changedValues: any, values: any) => {
        if (changedValues.category) {
            const cate = values.category;
            if (cate && cate.length > 0) {
                const f = cate.join(',');
                setFilter(`category=${f}`)
            } else {
                //reset data -> fetch all
                setFilter('')
            }
        }
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        if (values?.range?.from >= 0 && values?.range?.to >= 0) {
            let f = `price>=${values?.range.from}&price<=${values?.range?.to}`;
            if (values?.category?.length) {
                const cate = values?.category?.join(',')
                f += `&category=${cate}`
            }
            setFilter(f);
        }
    }

    const onChange = (key: string) => {
        console.log(key);
    };

    const items = [
        {
            key: 'sort=-sold',
            label: 'Phổ biến',
            children: <></>,
        },
        {
            key: 'sort=-updatedAt',
            label: 'Hàng mới',
            children: <></>,
        },
        {
            key: 'sort=price',
            label: 'Giá Thấp Đến Cao',
            children: <></>,
        },
        {
            key: 'sort=-price',
            label: 'Giá Cao Đến Thấp',
            children: <></>,
        },
    ]

    return (
        <>
            <div style={{ background: '#efefef', padding: "20px 0" }}>
                <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto ' }}>
                    <Row gutter={[20, 20]}>
                        <Col md={4} sm={0} xs={0}>
                            <div style={{ padding: "20px", background: '#fff', borderRadius: 5, border: "1px solid green" }}>
                                <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                    <span><FilterTwoTone />
                                        <span style={{ fontWeight: 500 }}>Bộ lọc tìm kiếm</span>
                                    </span>
                                    <ReloadOutlined title="Reset" onClick={() => {
                                        form.resetFields();
                                        setFilter('');
                                    }} />
                                </div>
                                <Divider />
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
                            </div>
                        </Col>

                        <Col md={20} sm={24} style={{ border: "1px solid red" }}>
                            <Spin spinning={isLoading} tip="Loading...">
                                <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                                    <Row>
                                        <Tabs
                                            defaultActiveKey="sort=-sold"
                                            items={items}
                                            onChange={(value) => { setSortQuery(value) }}
                                            style={{ overflowX: "auto" }}
                                        />
                                        <Col xs={24} md={0}>
                                            <div style={{ marginBottom: 20 }}>
                                                <span onClick={() => setShowMobileFilter(true)}>
                                                    <FilterTwoTone />
                                                    <span style={{ fontWeight: 500 }}>Bộ lọc</span>
                                                </span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="customize-row">
                                        {listBook?.map((item, index) => {
                                            return ((
                                                <div
                                                    onClick={() => navigate(`/book/${item._id}`)}
                                                    className="column" key={`book-${index}`}>
                                                    <div className="wrapper">
                                                        <div className="thumbnail">
                                                            <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`} />
                                                        </div>
                                                        <div className="text">{item.mainText}</div>
                                                        <div className="price">
                                                            {new Intl.NumberFormat(
                                                                'vi-VN',
                                                                { style: 'currency', currency: 'VND' }
                                                            ).format(item.price)}
                                                        </div>
                                                        <div className="rating">
                                                            <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                                            <span>Đã bán {item.sold}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        })}
                                    </Row>
                                    <div style={{ marginTop: 30 }}></div>
                                    <Row style={{ display: "flex", justifyContent: "center" }}>
                                        <Pagination
                                            current={current}
                                            pageSize={pageSize}
                                            total={total}
                                            responsive
                                            showSizeChanger
                                            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                                            onChange={(p, s) => handleOnChangePage({ current: p, pageSize: s })}
                                        />
                                    </Row>
                                </div>
                            </Spin>
                        </Col>
                    </Row>
                </div>
            </div >

            <MobileFilter
                isOpen={showMobileFilter}
                setIsOpen={setShowMobileFilter}
                handleChangeFilter={handleChangeFilter}
                listCategory={listCategory}
                onFinish={onFinish}
            />
        </>
    );
};

export default HomePage;