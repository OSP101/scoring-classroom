import React, { useState, useEffect } from 'react'
import { Tabs, Snippet, Tab, Chip, Spinner, Listbox, ListboxItem, Accordion, AccordionItem, DatePicker, Breadcrumbs, BreadcrumbItem, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, DropdownSection, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input } from "@heroui/react";
import { BsPlusLg } from "react-icons/bs";
import { MdWork } from "react-icons/md";
import { FaUserGroup, FaBookBookmark } from "react-icons/fa6";
import { parseDate, DateValue, today, getLocalTimeZone } from "@internationalized/date";
import { VerticalDotsIcon } from "../../Components/Icons/VerticalDotsIcon"
import { Prompt } from "next/font/google";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { FaStar } from "react-icons/fa";
import dynamic from 'next/dynamic'
import Link from 'next/link';

const FormExtra = dynamic(() => import('../Forms/FormExtra'), {
    loading: () => <Spinner color="secondary" />,
});
const FormKahoot = dynamic(() => import('../Forms/FormKahoot'), {
    loading: () => <Spinner color="secondary" />,
});
const FormEnter = dynamic(() => import('../Forms/FormEnter'), {
    loading: () => <Spinner color="secondary" />,
});
const FormEdit = dynamic(() => import('../Forms/FormEdit'), {
    loading: () => <Spinner color="secondary" />,
});


const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });

export default function WorkspaceTab(idcourse: any) {
    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0 hover:";
    const { isOpen: isOpenSolo, onOpen: onOpenSolo, onOpenChange: onOpenChangeSolo, onClose: onCloseSolo } = useDisclosure();
    const { isOpen: isOpenGroup, onOpen: onOpenGroup, onOpenChange: onOpenChangeGroup, onClose: onCloseGroup } = useDisclosure();
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onOpenChange: onOpenChangeEdit, onClose: onCloseEdit } = useDisclosure();
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onOpenChange: onOpenChangeDelete, onClose: onCloseDelete } = useDisclosure();
    const [isLoadedOne, setLoadingOne] = React.useState(false);
    const [isLoadedTwo, setLoadingTwo] = React.useState(false);

    interface Works {
        id: number;
        idcourse: string;
        name: string;
        date: string;
        typework: number;
        maxpoint: number;
    }

    interface Topics {
        id: number;
        name: string;
        des: string;
        status: number;
    }

    const [dataWorkOne, sedDataWorkOne] = useState<Works[]>([])
    const [dataWorkTwo, sedDataWorkTwo] = useState<Works[]>([])
    const [dataTopic, setDataTopic] = useState<Topics[]>([])
    const [visible, setVisible] = useState(false);
    const [extraPoint, setExtraPoint] = useState(false);
    const [kahootPoint, setKahootPoint] = useState(false);
    const [data, setData] = useState<Works>();
    const [statusUpdate, setStatusUpdate] = useState(false);
    const [selected, setSelected] = React.useState("enter");

    const handleSelectionChange = (key: any) => {
        setSelected(String(key));
    };


    var idtitel = "";
    const openModalWithData = (newData: string) => {
        idtitel = newData;
        const dataFind = dataWorkOne.find(work => work.id == parseInt(newData, 10));
        setData(dataFind);
        setVisible(true);
        // console.log(dataFind)
    };

    const [open, setOpen] = React.useState(false);
    const [dataAlert, setDataAlert] = useState("");
    const [idEdit, setIdEdit] = useState(0);
    const [editDetail, setEditDetail] = useState({
        id: 0,
        idcourse: idcourse.idcourse,
        name: '',
        date: today(getLocalTimeZone()).toString(),
        maxpoint: 0,
        typework: 0
    });
    const [deleteDetail, setDeleteDetail] = useState({
        id: 0,
        name: ''
    })

    const [textDelete, setTextDelete] = useState("")
    const [buttonCheck, setButtonCheck] = useState(false);
    const deleteCheck = (e: { target: { name: any; value: string; }; }) => {
        setTextDelete(e.target.value);
        if (e.target.value === deleteDetail.name) {
            setButtonCheck(true);
        } else {
            setButtonCheck(false);
        }
    };

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };


    const [valueDate, setValueDate] = React.useState<DateValue | null>(today(getLocalTimeZone()));

    const [createWork, setCreateWork] = useState({
        idcourse: idcourse.idcourse,
        name: '',
        date: `${valueDate?.year}-${String(valueDate?.month).padStart(2, '0')}-${String(valueDate?.day).padStart(2, '0')}`,
        maxpoint: '',
        typework: ''
    });

    const setzero = () => {
        setCreateWork({
            idcourse: idcourse.idcourse,
            name: '',
            date: `${valueDate?.year}-${String(valueDate?.month).padStart(2, '0')}-${String(valueDate?.day).padStart(2, '0')}`,
            maxpoint: '',
            typework: ''
        })

        setDeleteDetail({
            id: 0,
            name: ''
        })

        setEditDetail({
            id: 0,
            idcourse: idcourse.idcourse,
            name: '',
            date: "",
            maxpoint: 0,
            typework: 0
        });
    }

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setCreateWork({
            ...createWork,
            [e.target.name]: e.target.value
        });
    };

    const configData = (e: any) => {
        console.log(e);
        setCreateWork({
            ...createWork,
            idcourse: idcourse.idcourse,
            typework: '1'
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
        if (dataWorkOne.length == 0) {
            getDataWorkOne();
        }
        getDataWorkTwo();
        getTopic();
    }, []);

    const getTopic = async () => {
        try {

            const headers = new Headers({
                'Content-Type': 'application/json',
                'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
            });

            const responseTopic = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/topic`, {
                method: 'GET',
                headers: headers
            });
            if (!responseTopic.ok) {
                throw new Error(`Error fetching courses: ${responseTopic.statusText}`);
            }
            const dataCourses = await responseTopic.json();
            setDataTopic(dataCourses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    }

    const getDataWorkOne = async () => {
        try {
            const headers = new Headers({
                'Content-Type': 'application/json',
                'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
            });

            const responseone = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/work/typeone/${idcourse.idcourse}`, {
                method: 'GET',
                headers: headers
            });
            if (!responseone.ok) {
                throw new Error(`Error fetching courses: ${responseone.statusText}`);
            }
            const dataCourses = await responseone.json();
            sedDataWorkOne(dataCourses);
            setLoadingOne(true);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    }

    const getDataWorkTwo = async () => {

        try {
            const headers = new Headers({
                'Content-Type': 'application/json',
                'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
            });

            const responsetwo = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/work/typetwo/${idcourse.idcourse}`, {
                method: 'GET',
                headers: headers
            });
            if (!responsetwo.ok) {
                throw new Error(`Error fetching courses: ${responsetwo.statusText}`);
            }
            const dataCourses = await responsetwo.json();
            sedDataWorkTwo(dataCourses);
            setLoadingTwo(true);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    }

    const openDelete = (idDelete: number) => {
        const resultDelete1 = dataWorkOne.find(work => work.id == idDelete);
        const resultDelete2 = dataWorkTwo.find(work => work.id == idDelete);

        if (resultDelete1) {
            setDeleteDetail({
                id: idDelete,
                name: resultDelete1.name
            })
        } else if (resultDelete2) {
            setDeleteDetail({
                id: idDelete,
                name: resultDelete2.name
            })
        } else {
            setDeleteDetail({
                id: 0,
                name: ''
            })
        }

        onOpenDelete();
    }

    const openEdit = (idtitel: number) => {
        setIdEdit(idtitel);
        const resultEdit = dataWorkOne.find(work => work.id === idtitel);
        const resultEdit2 = dataWorkTwo.find(work => work.id === idtitel);

        if (resultEdit) {
            setEditDetail({
                id: resultEdit.id,
                idcourse: resultEdit.idcourse,
                name: resultEdit.name,
                date: resultEdit.date,
                maxpoint: resultEdit.maxpoint,
                typework: resultEdit.typework
            });
            setEditValueDate(parseDate(resultEdit.date))
        } else if (resultEdit2) {
            setEditDetail({
                id: resultEdit2.id,
                idcourse: resultEdit2.idcourse,
                name: resultEdit2.name,
                date: resultEdit2.date,
                maxpoint: resultEdit2.maxpoint,
                typework: resultEdit2.typework
            });
            setEditValueDate(parseDate(resultEdit2.date))

        }


        else {
            // กำหนดค่าเริ่มต้นหากไม่พบข้อมูล
            setEditDetail({
                id: 0,
                idcourse: '',
                name: '',
                date: "",
                maxpoint: 0,
                typework: 0
            });
        }

        onOpenEdit();
    }

    const [editValueDate, setEditValueDate] = React.useState<DateValue>(parseDate("2020-02-02"));
    // console.log(editValueDate);

    const handleChangeEdit = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setEditDetail(prevState => ({ ...prevState, [name]: value }));
        const dateEditSave = `${editValueDate.year}-${String(editValueDate.month).padStart(2, '0')}-${String(editValueDate.day).padStart(2, '0')}`;
        setEditDetail(prevState => ({ ...prevState, date: dateEditSave }));
    };


    const handleEditWork = async (e: any) => {
        const dateEditSave = `${e.year}-${String(e.month).padStart(2, '0')}-${String(e.day).padStart(2, '0')}`;
        setEditDetail(prevState => ({ ...prevState, date: dateEditSave }));
        setEditValueDate(e);

    }

    const editWorksubmit = async () => {
        setStatusUpdate(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/work/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ""
                },
                body: JSON.stringify(editDetail)
            });

            if (response.ok) {
                setStatusUpdate(false);
                const result = await response.json();
                setDataAlert("แก้ไขงานสำเร็จ !")
                setOpen(true);
                onCloseEdit();
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

    const deleteWorksubmit = async () => {
        setStatusUpdate(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/work/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ""
                },
                body: JSON.stringify(deleteDetail)
            });

            if (response.ok) {
                setStatusUpdate(false);
                const result = await response.json();
                setDataAlert("ลบงานสำเร็จ !")
                setOpen(true);
                onCloseDelete();
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

    return (
        <div className={`relative min-h-screen bg-gray-50 pb-24 ${kanit.className}`}>
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white shadow-sm px-4 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-800">งานทั้งหมด</h1>
                <div className="flex gap-2">
                    {/* ปุ่มคะแนนพิเศษ (desktop) */}
                    <Button onClick={() => setExtraPoint(true)} className="hidden md:flex items-center bg-yellow-400 text-white text-lg rounded-full shadow-lg px-4 py-2">
                        <FaStar className="text-xl mr-2" />
                        คะแนนพิเศษ
                    </Button>
                    {/* ปุ่มสร้างงาน (desktop) */}
                    <Button onClick={onOpenSolo} onPress={() => configData(idcourse.idcourse)} className="hidden md:flex bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white text-lg rounded-full shadow-lg px-4 py-2"><BsPlusLg className="text-xl mr-2" />สร้างงาน</Button>
                </div>
            </div>

            {/* Tabs: งานเดี่ยว/งานกลุ่ม */}
            <div className="w-full max-w-2xl mx-auto mt-4">
                <Tabs fullWidth color="secondary" variant="underlined" className="rounded-xl bg-white shadow-sm">
                    <Tab key="one" title={<span className="text-base font-semibold">งานเดี่ยว</span>}>
                        <WorkList
                            works={dataWorkOne}
                            loading={!isLoadedOne}
                            onOpen={openModalWithData}
                            onEdit={openEdit}
                            onDelete={openDelete}
                            typeColor="purple"
                            typeIcon="work"
                        />
                    </Tab>
                    <Tab key="two" title={<span className="text-base font-semibold">งานกลุ่ม</span>}>
                        <WorkList
                            works={dataWorkTwo}
                            loading={!isLoadedTwo}
                            onOpen={openModalWithData}
                            onEdit={openEdit}
                            onDelete={openDelete}
                            typeColor="pink"
                            typeIcon="group"
                        />
                    </Tab>
                </Tabs>
            </div>

            {/* Floating Action Button (FAB) for mobile */}
            <div className="fixed bottom-6 right-6 z-50 md:hidden flex flex-col gap-3 items-end">
                {/* ปุ่มคะแนนพิเศษ (mobile) */}
                <button
                    onClick={() => setExtraPoint(true)}
                    className="bg-yellow-400 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-2xl hover:scale-105 transition"
                    aria-label="คะแนนพิเศษ"
                >
                    <FaStar />
                </button>
                {/* ปุ่มสร้างงาน (mobile) */}
                <button
                    onClick={() => {
                        onOpenSolo();
                        configData(idcourse.idcourse);
                    }}
                    className="bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl hover:scale-105 transition"
                    aria-label="สร้างงานใหม่"
                >
                    <BsPlusLg />
                </button>
            </div>

            {/* Snackbar/Alert */}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%', fontSize: '1.1rem', py: 2 }}
                    className={kanit.className}
                >
                    <p className={kanit.className}>{dataAlert}</p>
                </Alert>
            </Snackbar>

            {/* Modal สำหรับกรอกคะแนน/แก้ไขคะแนน/สร้างงาน (คง logic เดิม) */}
            <Modal isOpen={visible} onClose={() => setVisible(false)} size='sm' placement="top-center" className={kanit.className} isDismissable={false} isKeyboardDismissDisabled={true} >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">{data?.name}</ModalHeader>
                    <ModalBody>
                        <div className="flex flex-col w-full">
                            <Tabs
                                fullWidth
                                size="md"
                                aria-label="Tabs form"
                                selectedKey={selected}
                                onSelectionChange={handleSelectionChange}
                                color="secondary"
                            >
                                <Tab key="enter" title="ลงคะแนน" className={kanit.className}>
                                    <FormEnter idcourse={idcourse.idcourse} idtitelwork={data?.id} maxpoint={data?.maxpoint} />

                                </Tab>
                                <Tab key="edit" title="แก้ไขคะแนน">
                                    <FormEdit idcourse={idcourse.idcourse} idtitelwork={data?.id} maxpoint={data?.maxpoint} />
                                </Tab>
                            </Tabs>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>


            {/* Modal สำหรับกรอกคะแนนพิเศษ */}
            <Modal isOpen={extraPoint} onClose={() => setExtraPoint(false)} placement="top-center" className={kanit.className} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">คะแนนพิเศษ {idcourse.idcourse} (Extra points)</ModalHeader>

                    <div className="flex flex-col w-full">
                        <FormExtra idcourse={idcourse.idcourse} />
                    </div>

                </ModalContent>
            </Modal>

            {/* Modal สำหรับกรอกคะแนน Kahoot */}
            <Modal isOpen={kahootPoint} onClose={() => setKahootPoint(false)} placement="top-center" className={kanit.className} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">คะแนน Kahoot! {idcourse.idcourse}</ModalHeader>

                    <div className="flex flex-col w-full">
                        <FormKahoot idcourse={idcourse.idcourse} />
                    </div>

                </ModalContent>
            </Modal>


            {/* Modal เพิ่มงานเดี่ยว */}
            <Modal isOpen={isOpenSolo} onOpenChange={onOpenChangeSolo} placement="top-center" className={kanit.className}>
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
                                        {statusUpdate ? (<><Spinner /> <p> กำลังสร้าง...</p></>) : "สร้าง"}
                                    </Button>

                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>


            {/* เพิ่มงานกลุ่ม */}
            <Modal isOpen={isOpenGroup} onOpenChange={onOpenChangeGroup} placement="top-center" className={kanit.className} isDismissable={false} isKeyboardDismissDisabled={true}>
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
                                        {statusUpdate ? (<><Spinner /> <p> กำลังสร้าง...</p></>) : "สร้าง"}
                                    </Button>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Modal แก้ไขงาน */}
            <Modal isOpen={isOpenEdit} onOpenChange={onOpenChangeEdit} placement="top-center" className={kanit.className} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent>
                    {(onCloseEdit) => (
                        <>
                            <form>
                                <ModalHeader className="flex flex-col gap-1">แก้ไขงาน</ModalHeader>

                                <ModalBody>
                                    <Input
                                        autoFocus
                                        label="ชื่อปฏิบัติการ"
                                        variant="bordered"
                                        isRequired
                                        name="name" value={editDetail.name} onChange={handleChangeEdit}
                                    />
                                    <Input
                                        label="คะแนนเต็ม"
                                        type="number"
                                        variant="bordered"
                                        isRequired
                                        name="maxpoint" value={String(editDetail.maxpoint)} onChange={handleChangeEdit}
                                    />
                                    <DatePicker label="วันเริ่มสอน" isRequired name="date" value={editValueDate} onChange={handleEditWork} />
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="flat" onPress={onCloseEdit}>
                                        ปิด
                                    </Button>
                                    <Button className={`bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-lg ${statusUpdate ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={editWorksubmit}>
                                        {statusUpdate ? (<><Spinner /> <p> กำลังบันทึก...</p></>) : "บันทึก"}
                                    </Button>

                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Modal ลบงาน */}
            <Modal isOpen={isOpenDelete} onOpenChange={onOpenChangeDelete} placement="top-center" className={kanit.className} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent>
                    {(onCloseDelete) => (
                        <>
                            <form>
                                <ModalHeader className="flex flex-col gap-1">ลบงาน
                                    <Alert variant="filled" severity="error">
                                        ลบงานแล้วจะไม่สามารถกู้คืนได้
                                    </Alert>
                                </ModalHeader>

                                <ModalBody>
                                    <p>พิมพ์ชื่องาน <b>{deleteDetail.name}</b> เพื่อลบงาน</p>
                                    <Input
                                        type="text"
                                        variant="bordered"
                                        isRequired
                                        name="maxpoint" value={textDelete} onChange={deleteCheck}
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="default" variant="light" onPress={onCloseDelete}>
                                        ปิด
                                    </Button>
                                    <Button color="danger" onClick={deleteWorksubmit} isDisabled={buttonCheck ? false : true} className={statusUpdate ? 'opacity-50 cursor-not-allowed' : ''}>
                                        {statusUpdate ? (<><Spinner /> <p> กำลังลบ...</p></>) : "ลบ"}
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

// WorkList: Card list for each tab
function WorkList({ works, loading, onOpen, onEdit, onDelete, typeColor, typeIcon }: any) {
    if (loading) {
        return <div className="flex justify-center py-8"><CircularProgress color="inherit" /></div>;
    }
    if (!works || works.length === 0) {
        return <p className="text-center text-gray-400 py-8">ไม่พบงาน</p>;
    }
    return (
        <div className="divide-y divide-gray-200 bg-white rounded-xl shadow-sm overflow-hidden">
            {works.map((item: any) => {
                const date = new Date(item.date);
                const formattedDate = !isNaN(date.getTime()) ? date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) : "Invalid Date";
                return (
                    <div
                        key={item.id}
                        className={`flex items-center px-3 py-4 hover:bg-${typeColor}-50 active:bg-${typeColor}-100 transition group cursor-pointer`}
                        onClick={() => onOpen(item.id.toString())}
                        tabIndex={0}
                        role="button"
                        aria-label={`ดูรายละเอียด ${item.name}`}
                    >
                        {/* Icon */}
                        <div className={`flex-shrink-0 mr-4 rounded-full bg-${typeColor}-100 w-12 h-12 flex items-center justify-center`}>
                            {typeIcon === "work" ? (
                                <MdWork className={`text-2xl text-${typeColor}-500`} />
                            ) : (
                                <FaUserGroup className={`text-2xl text-${typeColor}-500`} />
                            )}
                        </div>
                        {/* Name & Details */}
                        <div className="flex-1 min-w-0">
                            <div className="text-base font-medium text-gray-900 truncate">{item.name}</div>
                            <div className="text-xs text-gray-500 mt-1 md:hidden">โพสต์เมื่อ {formattedDate}</div>
                        </div>
                        {/* Date (desktop) */}
                        <div className="hidden md:block text-sm text-gray-500 mr-4">
                            โพสต์เมื่อ {formattedDate}
                        </div>
                        {/* 3 Dots */}
                        <Dropdown onClick={e => e.stopPropagation()}>
                            <DropdownTrigger>
                                <Button isIconOnly variant="light" className="text-gray-500 group-hover:bg-gray-200"><VerticalDotsIcon /></Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="เมนูงาน">
                                <DropdownItem key="detail" onPress={() => onOpen(item.id.toString())}>ดูรายละเอียด</DropdownItem>
                                <DropdownItem key="edit" onPress={() => onEdit(item.id)}>แก้ไข</DropdownItem>
                                <DropdownItem key="delete" onPress={() => onDelete(item.id)} className="text-danger" color="danger">ลบ</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            })}
        </div>
    );
}