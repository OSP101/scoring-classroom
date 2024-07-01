import React, { useState, useEffect } from 'react'
import { Autocomplete, AutocompleteItem, Avatar, Button, Input, Spinner, Divider, Textarea } from "@nextui-org/react";
import axios from 'axios';
import { Prompt } from "next/font/google";
import { useSession } from "next-auth/react"
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

interface FormEnterProps {
    idcourse: any;
    idtitelwork: any;
}

const FormEdit: React.FC<FormEnterProps> = ({ idcourse, idtitelwork }) => {

    interface Students {
        stdid: string;
        name: string;
        image: string
    }

    interface Point {
        stdid: string;
        point: number;
        teacher: string;
        key: string;
    }

    interface DataCheck {
        id: number;
        stdid: string;
        teachid: string;
        idtitelwork: number;
        point: number;
        create_at: string;
        update_at: string;
        delete_at: string;
    }

    const [dataUser, setDataUser] = useState<Students[]>([]);
    const [statusUpdate, setStatusUpdate] = useState(false);
    const [pointInput, setPointInput] = useState("");
    const [stdidInput, setStdidInput] = useState("")
    const [statusCheck, setStatusCheck] = useState(false);
    const [dataCheck, setDataCheck] = useState("");
    const { data: session, status } = useSession();
    const [idTeach, setIdTeach] = useState(session?.user?.name)
    const [desInput, setDesInput] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [dataAlert, setDataAlert] = useState("");
    const [dataChecks, setDataChecks] = useState<DataCheck>();

    useEffect(() => {
        getUser("0", idcourse);
        // onInputChange("")
    }, [])


    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const getUser = async (stdid: string, idcourse: string) => {
        try {
            const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/score/getuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ""
                },
                body: JSON.stringify({ stdid, idcourse })
            });
            if (data.ok) {
                const dataCourses = await data.json();
                setDataUser(dataCourses);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    }

    // console.log("DATAUSER ", dataUser)
    const onInputChange = (value: string) => {
        console.log("Data input ", value.length)
        setStdidInput(value);
        getUser(value, idcourse);
        if (value.length === 11) {
            checkuser(value);
        } if (value.length < 11) {
            setStatusCheck(false);
            console.log("Data user : 0")
        }
    };

    const statusButton = pointInput.length < 1 || stdidInput.length != 11 || desInput.length == 0;


    const checkuser = async (value: string) => {
        // console.log("Check user : ", idtitelwork.idtitelwork);
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/score/checkscore`,
                {
                    stdidInput: value,
                    idtitelwork
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': process.env.NEXT_PUBLIC_API_KEY
                    }
                }
            );
            console.log(response.data.length);
            setDataCheck(value);
            if (response.data.length > 0) {
                setStatusCheck(false)
                setDataChecks(response.data.data)
            } else {
                setStatusCheck(true)
                setDataChecks(response.data.data)

            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const submitpoint = async () => {
        setStatusUpdate(true)

        const formData = {
            stdid: stdidInput,
            teachid: idTeach,
            idtitelwork,
            point: pointInput,
            des: desInput,
            idcourse: idcourse
        }

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/score/edit/sendedit`,
                {
                    formData
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': process.env.NEXT_PUBLIC_API_KEY
                    }
                }
            );
            console.log(response.data);
            // setDataCheck(response.data.data);

            if (response.status === 201) {
                onInputChange("");
                setPointInput("");
                setDesInput("");
                setStatusUpdate(false)
                setDataAlert("[บันทึกขอการแก้ไขคะแนนสำเร็จ !")
                setOpen(true);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }


    }



    return (
        <div>
            <form className={`flex flex-col gap-4 ${kanit.className}`}>
                <Divider className="my-1" />
                <Autocomplete
                    inputValue={stdidInput}
                    onInputChange={onInputChange}
                    defaultItems={dataUser}
                    color="secondary"
                    classNames={{
                        listboxWrapper: "max-h-[320px]",
                        selectorButton: "text-default-500"
                    }}
                    listboxProps={{
                        hideSelectedIcon: true,
                        itemClasses: {
                            base: [
                                "text-default-500",
                                "transition-opacity",
                                "data-[hover=true]:text-foreground",
                                "dark:data-[hover=true]:bg-default-50",
                                "data-[pressed=true]:opacity-70",
                                "data-[hover=true]:bg-default-200",
                                "data-[selectable=true]:focus:bg-default-100",
                                "data-[focus-visible=true]:ring-default-500",
                            ],
                        },
                        emptyContent: 'ไม่พบนักศึกษาในวิชานี้'
                    }}
                    aria-label="Select an employee"
                    label="รหัสนักศึกษา"
                    placeholder="กรุณากรอกรหัสนักศึกษา"
                    popoverProps={{
                        offset: 5,
                        classNames: {
                            base: "rounded-large",
                            content: "p-1 border-small border-default-100 bg-background",
                        },
                    }}
                    variant="bordered"
                    isInvalid={statusCheck}
                >
                    {(item) => (
                        <AutocompleteItem key={item.name} textValue={item.stdid} className={kanit.className}>
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2 items-center">
                                    <Avatar alt={item.stdid} className="flex-shrink-0" size="sm" src={item.image} />
                                    <div className="flex flex-col">
                                        <span className="text-small">{item.name}</span>
                                        <span className="text-tiny text-default-400">{item.stdid}</span>
                                    </div>
                                </div>
                                <Button
                                    className="border-small mr-0.5 font-medium shadow-small"
                                    radius="full"
                                    size="md"
                                    variant="bordered"
                                >
                                    เลือก
                                </Button>
                            </div>
                        </AutocompleteItem>
                    )}
                </Autocomplete>

                <Input type="number" label="คะแนน" size='md' variant="bordered" placeholder='กรอกคะแนนตัวเลขเท่านั้น' color={pointInput.length > 0 ? statusCheck ? "danger" : "success" : "secondary"} value={pointInput} onValueChange={setPointInput} isInvalid={statusCheck} errorMessage={`รหัสนักศึกษา ${stdidInput} ยังไม่มีการลงคะแนน`} isDisabled={statusCheck} isRequired/>

                <Textarea
                    label="เหตุผล"
                    placeholder="ต้องระบุเหตุผลการแก้ไขคะแนน"
                    className=""
                    variant="bordered"
                    isRequired
                    onValueChange={setDesInput}
                    value={desInput}
                    isInvalid={statusCheck}
                    isDisabled={statusCheck}
                    color={desInput.length > 0 ? statusCheck ? "danger" : "success" : "secondary"}
                />

                <Button className={`bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-lg ${statusUpdate ? 'opacity-50 cursor-not-allowed' : ''} `} isDisabled={statusButton} onClick={submitpoint}>
                    {statusUpdate ? (<><Spinner color="default" /> <p> กำลังบันทึก...</p></>) : "บันทึก"}
                </Button>
            </form>

            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                    className={kanit.className}
                >
                    <p className={kanit.className}>{dataAlert}</p>
                </Alert>
            </Snackbar>
        </div>
    )
}
export default FormEdit;