import React, { useState, useEffect } from 'react'
import { Spinner, Divider, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Snippet } from "@nextui-org/react";
import axios from 'axios';

export default function PersonTab(idcouesr: any) {

    interface Persons {
        id: number,
        stdid: string,
        idcourse: string,
        name: string,
        email: string,
        section: number,
        image: string,
        track: string,
        type: number
    }

    enum LoadingState {
        Loading = "loading",
        Error = "error",
        Idle = "idle"
    }

    const [dataTeacher, setDataTeacher] = useState<Persons[]>([]);
    const [dataStudent, setDataStudent] = useState<Persons[]>([]);
    const [statusLoadTeach, setStatusLoadTeach] = useState(false);
    const [statusLoadStudent, setStatusLoadStudent] = useState(false);
    // let statusLoadTeach = "loading"

    useEffect(() => {
        if (idcouesr.idcouesr) {
            getDataTeacher();
            getDataStudent();
        }
    }, []);

    const getDataTeacher = async () => {
        try {
            const responseone = await axios.get<Persons[]>(`${process.env.NEXT_PUBLIC_API_URL}/enllo/teacher/${idcouesr.idcouesr}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY
                }
            });

            // console.log(responseone.data);

            setDataTeacher(responseone.data);
            setStatusLoadTeach(true);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error.message);
            } else {
                console.log('An unexpected error occurred');
            }
        }
    }

    const getDataStudent = async () => {
        try {
            const responseone = await axios.get<Persons[]>(`${process.env.NEXT_PUBLIC_API_URL}/enllo/person/${idcouesr.idcouesr}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY
                }
            });

            // console.log(responseone.data);

            setDataStudent(responseone.data);
            setStatusLoadStudent(true);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error.message);
            } else {
                console.log('An unexpected error occurred');
            }
        }
    }

    // console.log("dataTeacher : ", dataTeacher);
    // console.log(idcouesr.idcouesr)

    return (
        <div className={`container md:mx-auto w-full max-w-4xl pt-0`}>
            <h2 className='text-2xl mt-3'>อาจารย์</h2>
            <Divider className="my-2" />
            <Table removeWrapper aria-label="Teacher">
                <TableHeader>
                    <TableColumn>ชื่อ - นามสกุล</TableColumn>
                    <TableColumn>อีเมลล์</TableColumn>
                </TableHeader>
                <TableBody
                    items={dataTeacher ?? []}
                    loadingContent={<Spinner />}
                    loadingState={statusLoadTeach ? LoadingState.Idle : LoadingState.Loading}
                    emptyContent={"ไม่พบอาจารย์ผู้สอน"}
                >
                    {(item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <User
                                    avatarProps={{ radius: "lg", src: item.image }}
                                    description={`ผู้สอน`}
                                    name={item.name}
                                >
                                </User></TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <p className="text-bold text-sm ">{item.email}</p>
                                    <p className="text-bold text-sm text-default-400">{item.track}</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <h2 className='text-2xl mt-6'>นักศึกษา</h2>
            <Divider className="my-2" />
            <Table removeWrapper aria-label="Student">
                <TableHeader>
                    <TableColumn>ชื่อ - นามสกุล</TableColumn>
                    <TableColumn>อีเมลล์</TableColumn>
                </TableHeader>
                <TableBody
                    items={dataStudent ?? []}
                    loadingContent={<Spinner />}
                    loadingState={statusLoadTeach ? LoadingState.Idle : LoadingState.Loading}
                    emptyContent={"ไม่พบนักศึกษา"}
                >
                    {(item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <User
                                    avatarProps={{ radius: "lg", src: item.image }}
                                    description={<Snippet size="sm" variant="bordered" hideSymbol={true}>{item.stdid}</Snippet>}
                                    name={item.name}
                                >
                                </User></TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <p className="text-bold text-sm ">{item.email}</p>
                                    <p className="text-bold text-sm text-default-400">{item.track}</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
