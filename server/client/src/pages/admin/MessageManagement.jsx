
import { useFetchData } from '6pp';
import { Avatar, Box, Skeleton, Stack } from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import RenderAttachments from '../../components/shared/RenderAttachments';
import Table from '../../components/shared/Table';
import { server } from '../../constants/config';
import { useErrors } from '../../hooks/hook';
import { fileFormat, transformImage } from '../../lib/features';

const columns = [
    {
        field: "id",
        headerName: "ID",
        headerClassName: "table-header",
        width: 200
    },
    {
        field: "attachments",
        headerName: "Attachments",
        headerClassName: "table-header",
        width: 150,
        renderCell: (params) => {
            const { attachments } = params.row;

            return attachments?.length > 0 ?
                attachments.map((attachment, index) => {
                    const url = attachment.url;
                    const file = fileFormat(url);

                    return (
                        <Box key={index}>
                            <a
                                href={url}
                                download
                                target='_blank'
                                style={{
                                    color: "black"
                                }}
                            >
                                {RenderAttachments(file, url)}
                            </a>
                        </Box>
                    );
                })
                : "No Attachments";
        }
    },


    {
        field: "content",
        headerName: "Content",
        headerClassName: "table-header",
        width: 400
    },
    {
        field: "sender",
        headerName: "Sent By",
        headerClassName: "table-header",
        width: 200,
        renderCell: (params) => (
            <Stack>
                <Avatar alt={params.row.sender.name} src={params.row.sender.avatar} />
                <span>{params.row.sender.name}</span>
            </Stack>
        )
    },
    {
        field: "chat",
        headerName: "Chat",
        headerClassName: "table-header",
        width: 220
    },
    {
        field: "groupChat",
        headerName: "Group Chat",
        headerClassName: "table-header",
        width: 100
    },
    {
        field: "createdAt",
        headerName: "Time",
        headerClassName: "table-header",
        width: 250
    },
];
const MessageManagement = () => {

    const { loading, data, error } = useFetchData(`${server}/api/v1/admin/messages`, "dashboard-messages");
    console.log(data)
    useErrors([{
        isError: error,
        error: error
    }])

    const [rows, setRows] = useState([]);

    useEffect(() => {
       if(data){
        setRows(
            data.messages.map((i) => ({
                ...i,
                id: i._id,
                sender: {
                    name: i.sender.name,
                    avatar: transformImage(i.sender.avatar, 50)
                },
                createdAt: moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a")

            }))
        )
       }
    }, [data])

    return (
        <AdminLayout>
            {
                loading ? (<Skeleton height={"100vh"} />) : (
                    <Table heading={"All Messages"} columns={columns} rows={rows} />
                )
            }

        </AdminLayout>

    )
}

export default MessageManagement