import React, { useState, useEffect } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Spinner } from "@nextui-org/react";
import axios from 'axios';

export default function PointTab(idcouesr: any) {

    interface Points {
        "stdid": string;
        "name": string;
        "image": string;
        "count": number;
    }

    enum LoadingState {
        Loading = "loading",
        Error = "error",
        Idle = "idle"
    }



    const [dataPoint, setDataPoint] = useState<Points[]>([]);
    const [statusLoadTeach, setStatusLoadTeach] = useState(false);
    const idcourses = idcouesr.idcouesr;

    console.log(idcouesr)

    useEffect(() => {
        getPoint(idcourses);
    }, [])

    const getPoint = async (idcoursess: string) => {
        try {

            const headers = new Headers({
                'Content-Type': 'application/json',
                'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
            });

            const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/extrapoint/getpoint`,
                {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(idcourses)
                });
            if (data.ok) {
                const dataCourses = await data.json();
                setDataPoint(dataCourses);
                setStatusLoadTeach(true);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    }


    return (
        <div>
            <Table removeWrapper aria-label="Example static collection table">
                <TableHeader>
                    <TableColumn>ชื่อ - นามสกุล</TableColumn>
                    <TableColumn>คะแนนพิเศษ (Extra point)</TableColumn>
                    <TableColumn>Lab01</TableColumn>
                </TableHeader>
                <TableBody
                    items={dataPoint ?? []}
                    loadingContent={<Spinner color='secondary' />}
                    loadingState={statusLoadTeach ? LoadingState.Idle : LoadingState.Loading}
                    emptyContent={"ไม่พบอาจารย์ผู้สอน"}
                >
                    {(item) => (
                        <TableRow key={item.stdid}>
                            <TableCell>
                                <User
                                    avatarProps={{ radius: "lg", src: item.image }}
                                    description={item.stdid}
                                    name={item.name}
                                >
                                </User></TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <p className="text-bold text-sm ">{item.count}</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <p className="text-bold text-sm ">-</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
