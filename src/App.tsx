import {useEffect, useMemo, useState} from 'react'
import './App.css'

import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {Drawer} from "@mui/material";

const backendUrl = '/api/v1/app-service/get-apps'


function App() {

    const [tableData, setTableData] = useState([]);
    const [pageSize, setpageSize] = useState(50);
    const [pageNumber, setPageNumber] = useState(1);
    const [drawerState, setDrawerState] = useState(false);
    const [activeApp, setActiveApp] = useState<{ appName: string, category: string, appUsers: Array<string>} | null>(null);

    useEffect(() => {
        fetch(backendUrl, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'  // Set the Content-Type to application/json
            },
            body: JSON.stringify({
                "pageNumber": pageNumber,
                "pageSize": pageSize
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data, 'DATA');
                setTableData(data.appRows);
            })
            .catch(err => console.error("Error:", err));
    },[pageNumber, pageSize]);


    const rows = useMemo(() => {
        if(!tableData?.length) return []

        return tableData.map((row: {
            appId: string
        }) => ({
            ...row,
            id: row?.appId,
            connector: 'Reco'
        }))
    }, [tableData])


    const columns: GridColDef[] = [
        { field: 'appName', headerName: 'Name', width: 250 },
        { field: 'category', headerName: 'Category', width: 250 },
        { field: 'connector', headerName: 'Connector', width: 250 },
    ];

    const openDrawer = (appId) => {
        setDrawerState(true);

        fetch(`/api/v1/app-service/get-app-overview/${appId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '69420'
            },
        })
            .then(response => response.json())
            .then(data => {
                setActiveApp(data.appOverview)
            })
            .catch(err => console.error("Error:", err));

        fetch(`/api/v1/app-service/get-app-overview-users/${appId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '69420'
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data, 'DATA');
                setActiveApp((prevState) => ({
                    ...prevState,
                    appUsers: [...(data.appUsers || [])]
                }))
            })
            .catch(err => console.error("Error:", err));


    }

    const closeDrawer = () => {
        setDrawerState(false)
        setActiveApp(null)
    }

  return (
    <div style={{ height: 600, width: '100%' }}>
        <DataGrid
            initialState={{
                sorting: {
                    sortModel: [{ field: 'appName', sort: 'asc' }],
                },
                pagination: { paginationModel: { pageSize: 25 } },
            }}
            rows={rows}
            columns={columns}
            pageSizeOptions={[25, 50]}

            onRowClick={(row) => openDrawer(row.id)}
        />


        <Drawer open={drawerState} onClose={closeDrawer} anchor={'right'}>
            <div style={{ padding: 20 }}>
                <h3>App overview</h3>
                {activeApp && (
                    <>
                        <h4>{activeApp.appName}</h4>
                        <div style={{ border: '1px solid black' , borderRadius: '5px', padding: 12}}>
                            <h5>App Name: {activeApp.appName} </h5>
                            <h5>Category: {activeApp.category} </h5>
                            <h5>Connector: Reco </h5>
                        </div>
                    </>
                )}

                {!!activeApp?.appUsers?.length && (
                    <>
                        <h3>usernames</h3>
                        <ul>
                            {activeApp.appUsers.map(user=> (
                                <li>{user}</li>
                            ))}
                        </ul>

                    </>

                )}
            </div>

        </Drawer>
    </div>
  )
}

export default App
