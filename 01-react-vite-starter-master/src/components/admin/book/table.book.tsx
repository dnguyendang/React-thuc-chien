import { deleteBookAPI, getBooksAPI } from "@/services/api";
import { dateRangeValidate } from "@/services/helper";
import { DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Button, message, notification, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { CSVLink } from "react-csv";
import DetailBook from "./detail.book";
import CreateBook from "./create.book";
import UpdateBook from "./update.book";


type TSearch = {
    mainText: string,
    author: string,
    createdAtRange: string;
}

const TableBook = () => {
    const actionRef = useRef<ActionType>()

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });
    const [currentDataTable, setCurrentDataTable] = useState<IBookTable[]>([])

    const [openViewBookDetail, setOpenViewBookDetail] = useState<boolean>(false)
    const [dataViewBookDetail, setDataViewBookDetail] = useState<IBookTable | null>(null)

    const [openCreateBookModal, setOpenCreateBookModal] = useState<boolean>(false)

    const [openUpdateBookModal, setOpenUpdateBookModal] = useState<boolean>(false)
    const [dataUpdateBook, setDataUpdateBook] = useState<IBookTable | null>(null)

    const [isDeleteBook, setIsDeleteBook] = useState<boolean>(false)

    const columns: ProColumns<IBookTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'Id',
            dataIndex: '_id',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <a
                        onClick={() => {
                            setOpenViewBookDetail(true)
                            setDataViewBookDetail(entity)
                        }}
                        href="#">{entity._id}</a>
                )
            },
        },
        {
            title: 'Tên sách',
            dataIndex: 'mainText',
            ellipsis: true,
            sorter: true,
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            sorter: true,
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            sorter: true,
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        {new Intl.NumberFormat(
                            'vi-VN',
                            { style: 'currency', currency: 'VND' }
                        ).format(entity.price)}
                    </>
                )
            },
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor={"f57800"}
                            style={{ cursor: "pointer", marginRight: 15 }}
                            onClick={() => {
                                setDataUpdateBook(entity)
                                setOpenUpdateBookModal(true)
                            }}
                        />
                        <Popconfirm
                            title="Xác nhận xóa book"
                            description="Bạn có chắc chắn muốn xóa book này?"
                            okText="Xác nhận"
                            cancelText="Hủy"
                            placement='leftTop'
                            okButtonProps={{ loading: isDeleteBook }}
                            onConfirm={() => handleDeteleBook(entity._id)}
                        >
                            <DeleteTwoTone
                                twoToneColor={"ff4d4f"}
                                style={{ cursor: "pointer" }}
                            />
                        </Popconfirm>
                    </>
                )
            },
        },

    ]

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    const handleDeteleBook = async (id: string) => {
        setIsDeleteBook(true)
        const res = await deleteBookAPI(id)
        if (res && res.data) {
            message.success('Xóa book thành công');
            refreshTable();
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra!",
                description: res.message
            })
        }
        setIsDeleteBook(false)
    }

    return (
        <>
            <ProTable<IBookTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    let query = ""
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.mainText) {
                            query += `&mainText=/${params.mainText}/i`
                        }
                        if (params.author) {
                            query += `&author=/${params.author}/i`
                        }
                        const createDateRange = dateRangeValidate(params.createdAtRange)
                        if (createDateRange) {
                            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`
                        }
                    }

                    if (sort) {
                        if (sort?.mainText) {
                            query += `&sort=${sort.mainText === "ascend" ? "mainText" : "-mainText"}`
                        };
                        if (sort?.category) {
                            query += `&sort=${sort.category === "ascend" ? "category" : "-category"}`
                        };
                        if (sort?.author) {
                            query += `&sort=${sort.author === "ascend" ? "author" : "-author"}`
                        };
                        if (sort?.price) {
                            query += `&sort=${sort.price === "ascend" ? "price" : "-price"}`
                        };
                        if (sort?.createdAt) {
                            query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                        } else query += `&sort=-createdAt`;
                    }

                    const res = await getBooksAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta)
                        setCurrentDataTable(res.data?.result ?? [])
                    }

                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total
                    }
                }}

                rowKey={"_id"}
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    onChange: (total, range) => {
                        return (
                            <div>{range[0]}-{range[1]} trên {total} rows</div>
                        )
                    },
                }}
                headerTitle="Table book"
                toolBarRender={() => [
                    <CSVLink
                        data={currentDataTable}
                        filename='export-book.csv'
                    >
                        <Button
                            icon={<ExportOutlined />}
                            type="primary"
                        >
                            Export
                        </Button >
                    </CSVLink>,
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenCreateBookModal(true)
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>
                ]}
            />
            < DetailBook
                dataViewBookDetail={dataViewBookDetail}
                openViewBookDetail={openViewBookDetail}
                setDataViewBookDetail={setDataViewBookDetail}
                setOpenViewBookDetail={setOpenViewBookDetail}
            />
            <CreateBook
                openCreateBookModal={openCreateBookModal}
                refreshTable={refreshTable}
                setOpenCreateBookModal={setOpenCreateBookModal}
            />

            <UpdateBook
                openUpdateBookModal={openUpdateBookModal}
                dataUpdateBook={dataUpdateBook}
                refreshTable={refreshTable}
                setDataUpdateBook={setDataUpdateBook}
                setOpenUpdateBookModal={setOpenUpdateBookModal}
            />
        </>
    )
}

export default TableBook;