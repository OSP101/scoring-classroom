import React, { useState, useEffect } from 'react'
import { Popover, PopoverTrigger, PopoverContent, Spinner, Button, Listbox, ListboxItem, Accordion, AccordionItem, Modal, ModalContent, ModalHeader, ModalBody, Input, Textarea, Divider, ModalFooter } from "@heroui/react";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { VerticalDotsIcon } from "../../Components/Icons/VerticalDotsIcon"
import { FaUserGroup, FaBookBookmark } from "react-icons/fa6";
import { Prompt } from "next/font/google";
const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });
import { TbDatabaseEdit } from "react-icons/tb";
import { IoIosInformationCircleOutline } from "react-icons/io";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

export default function EditTab(idcouesr: any) {

  interface dataEdit {
    id: number;
    idtitelwork: number;
    stdid: string;
    teachid: string;
    teachedit: string;
    pointold: number;
    pointedit: number;
    des: string;
    status: number;
    idcourse: string;
    create_at: string;
    description_t: string;
    update_at: string;
    name: string;
    nameStd: string;
    idpoint: number;
  }

  const [dataEditOne, setDataEditOne] = useState<dataEdit[]>([]);
  const [dataEditTwo, setDataEditTwo] = useState<dataEdit[]>([]);
  const [dataEditTree, setDataEditTree] = useState<dataEdit[]>([]);
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0 hover:";
  const [isLoadedTwo, setLoadingTwo] = React.useState(false);
  const [data, setData] = useState<dataEdit>();
  const [visible, setVisible] = useState(false);
  const [visibleTwo, setVisibleTwo] = useState(false);
  const [visibleTree, setVisibleTree] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState(false);
  const [statusUpdateRe, setStatusUpdateRe] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [dataAlert, setDataAlert] = useState("");
  const [valueReject, setValueReject] = React.useState("");



  useEffect(() => {
    getData();
  }, [])

  const getData = async () => {
    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/score/edit/getedit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ""
        },
        body: JSON.stringify({ idcourse: idcouesr.idcouesr })
      })

      if (data.ok) {
        const dataCourses = await data.json();
        setDataEditOne(dataCourses[0]);
        setDataEditTwo(dataCourses[1]);
        setDataEditTree(dataCourses[2]);
        setLoadingTwo(true);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const openModalWithData = (newData: string, idmodal: number) => {
    var idedit = newData;
    if (idmodal === 1) {
      const dataFind = dataEditOne.find(work => work.id == parseInt(newData, 10));
      console.log("IDFind",newData)
      console.log("dataEditOne",dataEditOne)
      console.log("dataFind",dataFind)
      setData(dataFind);
      setVisible(true);
    } else if (idmodal === 2) {
      const dataFind = dataEditTwo.find(work => work.id == parseInt(newData, 10));
      setData(dataFind);
      setVisibleTwo(true);
    } else if (idmodal === 3) {
      const dataFind = dataEditTree.find(work => work.id == parseInt(newData, 10));
      setData(dataFind);
      setVisibleTree(true);
    }

    // console.log(dataFind)
  };


  const submiteditpoint = async () => {
    setStatusUpdate(true);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/score/edit/confermedit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ""
      },
      body: JSON.stringify({ idedit: data?.id, idpoints: data?.idpoint, point: data?.pointedit })
    }).then((data) => {
      if (data.status === 201) {
        setStatusUpdate(false)
        setDataAlert("อนุมัติการแก้ไขคะแนนสำเร็จ !")
        setOpen(true);
        setVisible(false);
        getData();
      }
    })

    console.log({idedit: data?.id, idpoints: data?.idpoint, point: data?.pointedit}) 
  }

  const submitreject = async () => {
    setStatusUpdateRe(true);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/score/edit/rejrctedit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ""
      },
      body: JSON.stringify({ idedit: data?.id, des: valueReject })
    }).then((data) => {
      if (data.status === 201) {
        setStatusUpdateRe(false)
        setDataAlert("ปฏิเสธการแก้ไขคะแนนสำเร็จ !")
        setOpen(true);
        setVisible(false);
        getData();
      }
    })

    // console.log({idedit: data?.id, des: valueReject}) 

  }

  return (
    <div className={`container mx-auto w-full max-w-4xl ${kanit.className}`}>

      <div className={`px-2 pb-4 pt-0 ${kanit.className}`}>
        <Accordion variant="splitted" selectionMode="multiple" defaultExpandedKeys={["1", "2", "3"]}>
          <AccordionItem key="1" aria-label="คะแนนรอแก้ไข" title="คะแนนรอแก้ไข" className='mb-3'>
            {!isLoadedTwo ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress color="inherit" />
                </Box>
              </>
            ) : (
              <>
                {dataEditOne.length > 0 ? (
                  <Listbox
                    items={dataEditOne}
                    aria-label="Dynamic Actions"
                    className={kanit.className}
                    onAction={(key) => {
                      // const selectedItem = dataEditOne.find(item => item.id.toString() === key.toString());
                      console.log("Key",key.toString())  
                      openModalWithData(key.toString(), 1);
                    }}
                  >
                    {dataEditOne.map((item) => {
                      const date = new Date(item.create_at);
                      const randomFloat = Math.random() * (1000 - 1) + 1;
                      const formattedDate = !isNaN(date.getTime()) ? date.toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric'
                      }) : "Invalid Date";

                      return (
                        <ListboxItem
                          key={item.id}
                          color={"default"}
                          endContent={<IoIosInformationCircleOutline />}
                          description={`รหัสนักศึกษา: ${item.stdid} | วันที่แจ้ง: ${formattedDate}`}
                          startContent={<TbDatabaseEdit className={iconClasses} />}
                          showDivider
                          textValue={item.name}

                        >
                          {item.name} {item.nameStd}
                        </ListboxItem>
                      );
                    })}
                  </Listbox>

                ) : (
                  <>
                    <p className='text-center text-sm font-light mb-3'>ไม่พบการแก้ไข</p>
                  </>
                )}

              </>
            )}

          </AccordionItem>
          <AccordionItem key="2" aria-label="อนุมัติการแก้ไขแล้ว" title="อนุมัติการแก้ไขแล้ว" className='mb-3'>
            {!isLoadedTwo ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress color="inherit" />
                </Box>
              </>
            ) : (
              <>
                {dataEditTwo.length > 0 ? (
                  <Listbox
                    items={dataEditTwo}
                    aria-label="Dynamic Actions"
                    className={kanit.className}
                    onAction={(label) => openModalWithData(label.toString(), 2)}
                  >
                    {dataEditTwo.map((item) => {
                      const date = new Date(item.update_at);
                      const randomFloat = Math.random() * (200000 - 100001) + 1;
                      const formattedDate = !isNaN(date.getTime()) ? date.toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric'
                      }) : "Invalid Date";

                      return (
                        <ListboxItem
                          key={item.id}
                          color={"default"}
                          endContent={<IoIosInformationCircleOutline />}
                          description={`รหัสนักศึกษา: ${item.stdid} | วันที่อนุมัติ: ${formattedDate}`}
                          startContent={<TbDatabaseEdit className={iconClasses} />}
                          showDivider
                          textValue={item.name}
                        >
                          {item.name} {item.nameStd}
                        </ListboxItem>
                      );
                    })}
                  </Listbox>

                ) : (
                  <>
                    <p className='text-center text-sm font-light mb-3'>ไม่พบการแก้ไข</p>
                  </>
                )}

              </>
            )}
          </AccordionItem>

          <AccordionItem key="3" aria-label="ปฏิเสธอนุมัติการแก้ไข" title="ปฏิเสธอนุมัติการแก้ไข">
            {!isLoadedTwo ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress color="inherit" />
                </Box>
              </>
            ) : (
              <>
                {dataEditTree.length > 0 ? (
                  <Listbox
                    items={dataEditTree}
                    aria-label="Dynamic Actions"
                    className={kanit.className}
                    onAction={(label) => openModalWithData(label.toString(), 3)}
                  >
                    {dataEditTree.map((item) => {
                      const date = new Date(item.update_at);
                      const randomFloat = Math.random() * (300000 - 200001) + 1;
                      const formattedDate = !isNaN(date.getTime()) ? date.toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric'
                      }) : "Invalid Date";

                      return (
                        <ListboxItem
                          key={randomFloat+item.id}
                          color={"default"}
                          endContent={<IoIosInformationCircleOutline />}
                          description={`รหัสนักศึกษา: ${item.stdid} | วันที่อนุมัติ: ${formattedDate}`}
                          startContent={<TbDatabaseEdit className={iconClasses} />}
                          showDivider
                          textValue={item.name}
                        >
                          {item.name} {item.nameStd}
                        </ListboxItem>
                      );
                    })}
                  </Listbox>

                ) : (
                  <>
                    <p className='text-center text-sm font-light mb-3'>ไม่พบการแก้ไข</p>
                  </>
                )}

              </>
            )}
          </AccordionItem>
        </Accordion>
      </div>

      <Modal isOpen={visible} onClose={() => setVisible(false)} placement="top-center" className={kanit.className} isDismissable={false} isKeyboardDismissDisabled={true} >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">{`รายละเอียดการแก้ไขคะแนน ${data?.name}`}</ModalHeader>
          <ModalBody>
            <div className="flex flex-col w-full">
              <Input type="text" label="รหัสนักศึกษา" className='mb-3' size='sm' color='secondary' isReadOnly value={data?.nameStd} />
              <Divider className="my-3" />
              <Input type="text" label="ผู้ลงคะแนนเดิม" className='mb-3' size='sm' color='secondary' isReadOnly value={data?.teachid} />
              <Input type="text" label="คะแนนเดิม" className='mb-3' size='sm' color='secondary' isReadOnly value={data?.pointold.toString()} />
              <Divider className="my-3" />
              <Input type="text" label="ผู้ขอแก้ไขคะแนน" className='mb-3' size='sm' color='secondary' isReadOnly value={data?.teachedit} />
              <Input type="text" label="คะแนนใหม่" className='mb-3' size='sm' color='secondary' isReadOnly value={data?.pointedit.toString()} />
              <Textarea
                label="เหตุผล"
                color='secondary'
                isReadOnly
                value={data?.des}
              />
            </div>

          </ModalBody>
          <ModalFooter>
            <Popover
              showArrow
              offset={10}
              placement="bottom"
              backdrop='opaque'
            >
              <PopoverTrigger>
                <Button color="warning" variant="flat" className="capitalize">
                  ไม่อนุมัติ
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[240px]">

                <div className="px-1 py-2 w-full">
                  <p className="text-small font-bold text-foreground">
                    เหตุผลไม่อนุมัติการแก้ไข
                  </p>
                  <div className="mt-2 flex flex-col gap-2 w-full">
                    <Textarea
                      label="เหตุผลไม่อนุมัติ"
                      color='secondary'
                      value={valueReject}
                      onValueChange={setValueReject}
                    />
                  </div>
                </div>
                <Button fullWidth className={`bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-lg ${statusUpdate ? 'opacity-50 cursor-not-allowed' : ''} mb-1`} onClick={submitreject}>
                  {statusUpdateRe ? (<><Spinner color="default" /> <p> กำลังบันทึก...</p></>) : "บันทึก"}
                </Button>
              </PopoverContent>
            </Popover>
            <Button className={`bg-gradient-to-tr from-[#FF1CF7] to-[#b249f8] text-white shadow-lg ${statusUpdate ? 'opacity-50 cursor-not-allowed' : ''} `} onClick={submiteditpoint}>
              {statusUpdate ? (<><Spinner color="default" /> <p> กำลังอนุมัติ...</p></>) : "อนุมัติ"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={visibleTwo} onClose={() => setVisibleTwo(false)} placement="top-center" className={kanit.className} isDismissable={false} isKeyboardDismissDisabled={true} >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">{`รายละเอียดการแก้ไขคะแนน ${data?.name}`}</ModalHeader>
          <ModalBody>
            <div className="flex flex-col w-full">
              <Input type="text" label="รหัสนักศึกษา" className='mb-3' size='sm' color='secondary' isReadOnly value={data?.nameStd} />
              <Divider className="my-3" />
              <Input type="text" label="ผู้ลงคะแนนเดิม" className='mb-3' size='sm' color='secondary' isReadOnly value={data?.teachid} />
              <Input type="text" label="คะแนนเดิม" className='mb-3' size='sm' color='secondary' isReadOnly value={data?.pointold.toString()} />
              <Divider className="my-3" />
              <Input type="text" label="ผู้ขอแก้ไขคะแนน" className='mb-3' size='sm' color='secondary' isReadOnly value={data?.teachedit} />
              <Input type="text" label="คะแนนใหม่" className='mb-3' size='sm' color='secondary' isReadOnly value={data?.pointedit.toString()} />
              <Textarea
                label="เหตุผล"
                color='secondary'
                isReadOnly
                value={data?.des}
              />
            </div>

          </ModalBody>

        </ModalContent>
      </Modal>

      <Modal isOpen={visibleTree} onClose={() => setVisibleTree(false)} placement="top-center" className={kanit.className} isDismissable={false} isKeyboardDismissDisabled={true} >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">{`รายละเอียดการแก้ไขคะแนน ${data?.name}`}</ModalHeader>
          <ModalBody>
            <div className="flex flex-col w-full">
              <Input type="text" label="รหัสนักศึกษา" className='mb-3' size='sm' color='secondary' isReadOnly value={data?.nameStd} />
              <Divider className="my-3" />
              <Input type="text" label="ผู้ลงคะแนนเดิม" className='mb-3' size='sm' color='secondary' isReadOnly value={data?.teachid} />
              <Input type="text" label="คะแนนเดิม" className='mb-3' size='sm' color='secondary' isReadOnly value={data?.pointold.toString()} />
              <Divider className="my-3" />
              <Input type="text" label="ผู้ขอแก้ไขคะแนน" className='mb-3' size='sm' color='secondary' isReadOnly value={data?.teachedit} />
              <Input type="text" label="คะแนนใหม่" className='mb-3' size='sm' color='secondary' isReadOnly value={data?.pointedit.toString()} />
              <Textarea
                label="เหตุผล"
                color='secondary'
                isReadOnly
                value={data?.des}
              />
              <Divider className="my-3" />
              <Textarea
                label="เหตุผลการปฏิเสธ"
                color='secondary'
                isReadOnly
                value={data?.description_t}
                className='mb-3'
              />
            </div>

          </ModalBody>

        </ModalContent>
      </Modal>

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
