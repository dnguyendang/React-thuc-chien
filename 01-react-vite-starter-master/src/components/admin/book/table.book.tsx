import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Popconfirm } from "antd";
import { useRef, useState } from "react";


type TSearch = {
    mainText: string,
    author: string,
}

const TableBook = () => {
    const actionRef = useRef<ActionType>()
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
                    <a href="#">{entity._id}</a>
                )
            },
        },
        {
            title: 'Tên sách',
            dataIndex: 'mainText',
            ellipsis: true,
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            sorter: true,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: true,
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
                        />
                        <Popconfirm
                            title="Xác nhận xóa book"
                            description="Bạn có chắc chắn muốn xóa book này?"
                            okText="Xác nhận"
                            cancelText="Hủy"
                            placement='leftTop'
                            okButtonProps={{ loading: isDeleteBook }}
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
                    }

                    if (sort && sort.created_at) {
                        if (sort?.createdAt) {
                            query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                        } else query += `&sort=-createdAt`;
                        if (sort?.price) {
                            query += `&sort=${sort.price === "ascend" ? "price" : "-price"}`
                        }
                    }
                    return (
                        <></>
                    )
                }}
            >
            </ProTable >
        </>
    )
}

export default TableBook;