import React, { useState, useEffect } from 'react'
import { Spinner, Listbox, ListboxItem, Accordion, AccordionItem, DatePicker, DateInput, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, DropdownSection, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Checkbox, Input, Link } from "@nextui-org/react";
import { BsPlusLg } from "react-icons/bs";
import { MdWork } from "react-icons/md";
import { FaUserGroup, FaBookBookmark } from "react-icons/fa6";
import { CalendarDate, parseDate, DateValue, today, getLocalTimeZone } from "@internationalized/date";
import { VerticalDotsIcon } from "../../Components/Icons/VerticalDotsIcon"
import { Prompt } from "next/font/google";
// import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import axios from 'axios'


const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

export default function WorkspaceTab(idcourse: any) {
    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
    const { isOpen: isOpenSolo, onOpen: onOpenSolo, onOpenChange: onOpenChangeSolo, onClose: onCloseSolo } = useDisclosure();
    const { isOpen: isOpenGroup, onOpen: onOpenGroup, onOpenChange: onOpenChangeGroup, onClose: onCloseGroup } = useDisclosure();
    const [isLoadedOne, setLoadingOne] = React.useState(false);
    const [isLoadedTwo, setLoadingTwo] = React.useState(false);

    interface Works {
        id: number;
        idcourse: string;
        name: string;
        date: Date;
        typework: number;
        maxpoint: number;
    }

    const [dataWorkOne, sedDataWorkOne] = useState<Works[]>([])
    const [dataWorkTwo, sedDataWorkTwo] = useState<Works[]>([])
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState('');
    const [statusUpdate, setStatusUpdate] = useState(false);

    const openModalWithData = (newData: React.SetStateAction<string>) => {
        setData(newData);
        setVisible(true);
    };

    const [open, setOpen] = React.useState(false);
    const [dataAlert, setDataAlert] = useState("");
    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const [valueDate, setValueDate] = React.useState<DateValue>(today(getLocalTimeZone()));

    const { day, month, year } = valueDate;

    const [createWork, setCreateWork] = useState({
        idcourse: '',
        name: '',
        date: `${year}-${month}-${day}`,
        maxpoint: '',
        typework: ''
    });

    const setzero = () => {
        setCreateWork({
            idcourse: '',
            name: '',
            date: `${year}-${month}-${day}`,
            maxpoint: '',
            typework: ''
        })
    }

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setCreateWork({
            ...createWork,
            [e.target.name]: e.target.value
        });
    };

    const configData = (e: any) => {
        console.log("Config data");
        setCreateWork({
            ...createWork,
            idcourse: idcourse.idcourse,
            typework: e
        });
    }

    const handleSubmitWork = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setStatusUpdate(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/work/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ""
                },
                body: JSON.stringify(createWork)
            });

            if (response.ok) {
                setStatusUpdate(false);
                const result = await response.json();
                setDataAlert("สร้างงานสำเร็จ !")
                setOpen(true);
                onCloseSolo();
                onCloseGroup();
                setzero();
                getDataWorkTwo();
                getDataWorkOne();

            } else {

            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting the data');
        }
    }
    useEffect(() => {
        if(dataWorkOne.length == 0){
            getDataWorkOne();
        }
        getDataWorkTwo();
    }, []);

    const getDataWorkOne = async () => {
        try {
            const responseone = await axios.get<Works[]>(`${process.env.NEXT_PUBLIC_API_URL}/work/typeone/${idcourse.idcourse}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY
                }
            });

            sedDataWorkOne(responseone.data);
            setLoadingOne(true);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.message);
            } else {
                setError('An unexpected error occurred');
            }
        }
    }

    const getDataWorkTwo = async () => {
        try {
            const responsetwo = await axios.get<Works[]>(`${process.env.NEXT_PUBLIC_API_URL}/work/typetwo/${idcourse.idcourse}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY
                }
            });

            sedDataWorkTwo(responsetwo.data);
            setLoadingTwo(true);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.message);
            } else {
                setError('An unexpected error occurred');
            }
        }
    }

    console.log("Works : ", dataWorkOne)

    return (
        <div className={`container mx-auto w-full max-w-4xl ${kanit.className}`}>

            <div className={`px-2 pb-4 ${kanit.className}`}>
                <Dropdown>
                    <DropdownTrigger>
                        <Button className={`bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-lg ${kanit.className}`}>
                            <BsPlusLg /> สร้าง
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions" className={kanit.className}>
                        <DropdownSection title="สร้าง">
                            <DropdownItem
                                key="new"
                                description="งานเดี่ยวสำหรับลงคะแนน"
                                startContent={<MdWork className={iconClasses} />}
                                onPress={onOpenSolo}
                                onAction={() => configData("1")}
                            >
                                งานเดี่ยว
                            </DropdownItem>
                            <DropdownItem
                                key="group"
                                description="งานกลุ่มนำเสนอ"
                                startContent={<FaUserGroup className={iconClasses} />}
                                onPress={onOpenGroup}
                                onAction={() => configData("2")}

                            >
                                งานนำเสนอ
                            </DropdownItem>
                        </DropdownSection>
                    </DropdownMenu>
                </Dropdown>
            </div>



            <Accordion variant="splitted" selectionMode="multiple" defaultExpandedKeys={["1", "2"]}>
                <AccordionItem key="1" aria-label="งานเดี่ยว" title="งานเดี่ยว">
                    {!isLoadedOne ? (
                        <>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress color="inherit" />
                            </Box>
                        </>
                    ) : (
                        <>
                            {dataWorkOne.length > 0 ? (
                                <Listbox
                                    items={dataWorkOne}
                                    aria-label="Dynamic Actions"
                                    onAction={(label) => openModalWithData(`Hello from Button ${label}`)}
                                    className={kanit.className}
                                >
                                    {dataWorkOne.map((item) => {
                                        const date = new Date(item.date);
                                        const formattedDate = !isNaN(date.getTime()) ? date.toLocaleDateString('th-TH', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : "Invalid Date";

                                        return (
                                            <ListboxItem
                                                key={item.id}
                                                color={"default"}
                                                endContent={
                                                    <Dropdown>
                                                        <DropdownTrigger>
                                                            <Button isIconOnly size="sm" variant="light">
                                                                <VerticalDotsIcon className="text-default-500" />
                                                            </Button>
                                                        </DropdownTrigger>
                                                        <DropdownMenu>
                                                            <DropdownItem onClick={() => { setOpen(true); }}>แก้ไข</DropdownItem>
                                                            <DropdownItem className="text-danger" color="danger">ลบ</DropdownItem>
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                }
                                                description={formattedDate}
                                                startContent={<FaBookBookmark className={iconClasses} />}
                                                showDivider
                                            >
                                                {item.name}
                                            </ListboxItem>
                                        );
                                    })}
                                </Listbox>

                            ) : (
                                <>
                                    <p className='text-center text-sm font-light mb-3'>ไม่พบงาน</p>
                                </>
                            )}

                        </>
                    )}

                </AccordionItem>
                <AccordionItem key="2" aria-label="งานกลุ่ม" title="งานกลุ่ม">
                    {!isLoadedTwo ? (
                        <>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress color="inherit" />
                            </Box>
                        </>
                    ) : (
                        <>
                            {dataWorkTwo.length > 0 ? (
                                <Listbox
                                    items={dataWorkTwo}
                                    aria-label="Dynamic Actions"
                                    onAction={(label) => openModalWithData(`Hello from Button ${label}`)}
                                    className={kanit.className}
                                >
                                    {dataWorkTwo.map((item) => {
                                        const date = new Date(item.date);
                                        const formattedDate = !isNaN(date.getTime()) ? date.toLocaleDateString('th-TH', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : "Invalid Date";

                                        return (
                                            <ListboxItem
                                                key={item.id}
                                                color={"default"}
                                                endContent={
                                                    <Dropdown>
                                                        <DropdownTrigger>
                                                            <Button isIconOnly size="sm" variant="light">
                                                                <VerticalDotsIcon className="text-default-500" />
                                                            </Button>
                                                        </DropdownTrigger>
                                                        <DropdownMenu>
                                                            <DropdownItem onClick={() => { setOpen(true); }}>แก้ไข</DropdownItem>
                                                            <DropdownItem className="text-danger" color="danger">ลบ</DropdownItem>
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                }
                                                description={formattedDate}
                                                startContent={<FaBookBookmark className={iconClasses} />}
                                                showDivider
                                            >
                                                {item.name}
                                            </ListboxItem>
                                        );
                                    })}
                                </Listbox>

                            ) : (
                                <>
                                    <p className='text-center text-sm font-light mb-3'>ไม่พบงาน</p>
                                </>
                            )}

                        </>
                    )}
                </AccordionItem>
            </Accordion>

            {/* Alrt สำหรับแจ้งว่าสร้างสำเร็จ */}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
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

            {/* Modal สำหรับกรอกคะแนน แก้ไขคะแนน */}
            <Modal isOpen={visible} onClose={() => setVisible(false)} placement="center" className={kanit.className}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">สร้างงานเดี่ยว</ModalHeader>
                    <ModalBody>
                        <p>{data}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="flat" onPress={() => setVisible(false)}>
                            ปิด
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>


            {/* Modal เพิ่มงานเดี่ยว */}
            <Modal isOpen={isOpenSolo} onOpenChange={onOpenChangeSolo} placement="center" className={kanit.className}>
                <ModalContent>
                    {(onCloseSolo) => (
                        <>
                            <form>
                                <ModalHeader className="flex flex-col gap-1">สร้างงานเดี่ยว</ModalHeader>

                                <ModalBody>
                                    <Input
                                        autoFocus
                                        label="ชื่อปฏิบัติการ"
                                        variant="bordered"
                                        isRequired
                                        name="name" value={createWork.name} onChange={handleChange}
                                    />
                                    <Input
                                        label="คะแนนเต็ม"
                                        type="number"
                                        variant="bordered"
                                        isRequired
                                        name="maxpoint" value={createWork.maxpoint} onChange={handleChange}
                                    />
                                    <DatePicker label="วันเริ่มสอน" isRequired name="date" value={valueDate} onChange={setValueDate} minValue={today(getLocalTimeZone())} />
                                    <input type="hidden" name="idcourse" value={idcourse} />
                                    <input type="hidden" name="typework" value="1" />
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="flat" onPress={onCloseSolo}>
                                        ปิด
                                    </Button>
                                    <Button className={`bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-lg ${statusUpdate ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleSubmitWork}>
                                        {statusUpdate ? "กำลังสร้าง..." : "สร้าง"}
                                    </Button>

                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>


            {/* เพิ่มงานกลุ่ม */}
            <Modal isOpen={isOpenGroup} onOpenChange={onOpenChangeGroup} placement="center" className={kanit.className}>
                <ModalContent>
                    {(onCloseGroup) => (
                        <>
                            <form>
                                <ModalHeader className="flex flex-col gap-1">สร้างงานนำเสนอ</ModalHeader>
                                <ModalBody>
                                    <Input
                                        autoFocus
                                        label="ชื่องานนำเสนอ"
                                        variant="bordered"
                                        isRequired
                                        name="name" value={createWork.name} onChange={handleChange}
                                    />
                                    <Input
                                        label="คะแนนเต็ม"
                                        type="number"
                                        variant="bordered"
                                        isRequired
                                        name="maxpoint" value={createWork.maxpoint} onChange={handleChange}
                                    />
                                    <DatePicker label="วันเริ่มสอน" isRequired name="date" value={valueDate} onChange={setValueDate} minValue={today(getLocalTimeZone())} />

                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="flat" onPress={onCloseGroup}>
                                        ปิด
                                    </Button>
                                    <Button className={`bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-lg ${statusUpdate ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleSubmitWork}>
                                        {statusUpdate ? "กำลังสร้าง..." : "สร้าง"}
                                    </Button>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

function setError(message: string) {
    throw new Error("Function not implemented.");
}