import React, { useState, useEffect } from 'react'
import { Tabs, Tab, Chip, Spinner, Listbox, ListboxItem, Accordion, AccordionItem, DatePicker, DateInput, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, DropdownSection, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input } from "@nextui-org/react";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { VerticalDotsIcon } from "../../Components/Icons/VerticalDotsIcon"
import { FaUserGroup, FaBookBookmark } from "react-icons/fa6";
import { Prompt } from "next/font/google";
const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });
import { TbDatabaseEdit } from "react-icons/tb";
import { IoIosInformationCircleOutline } from "react-icons/io";

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
  }

  const [dataEditOne, setDataEditOne] = useState<dataEdit[]>([]);
  const [dataEditTwo, setDataEditTwo] = useState<dataEdit[]>([]);
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0 hover:";
  const [isLoadedTwo, setLoadingTwo] = React.useState(false);
  const [data, setData] = useState<dataEdit>();
  const [visible, setVisible] = useState(false);


  useEffect(() => {
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
          setLoadingTwo(true);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    }

    getData();
  }, [])
  var idedit = "";
  const openModalWithData = (newData: string) => {
    idedit = newData;
    const dataFind = dataEditOne.find(work => work.id == parseInt(newData, 10));
    setData(dataFind);
    setVisible(true);
    // console.log(dataFind)
  };

  return (
    <div className={`container mx-auto w-full max-w-4xl ${kanit.className}`}>

      <div className={`px-2 pb-4 pt-0 ${kanit.className}`}>
        <Accordion variant="splitted" selectionMode="multiple" defaultExpandedKeys={["1", "2"]}>
          <AccordionItem key="1" aria-label="คะแนนรอแก้ไข" title="คะแนนรอแก้ไข">
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
                    onAction={(label) => openModalWithData(label.toString())}
                  >
                    {dataEditOne.map((item) => {
                      const date = new Date(item.create_at);
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
                    <p className='text-center text-sm font-light mb-3'>ไม่พบงาน</p>
                  </>
                )}

              </>
            )}

          </AccordionItem>
          <AccordionItem key="2" aria-label="อนุมัติการแก้ไขแล้ว" title="อนุมัติการแก้ไขแล้ว">
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
                  >
                    {dataEditTwo.map((item) => {
                      const date = new Date(item.update_at);
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
                    <p className='text-center text-sm font-light mb-3'>ไม่พบงาน</p>
                  </>
                )}

              </>
            )}
          </AccordionItem>
        </Accordion>
      </div>

      <Modal isOpen={visible} onClose={() => setVisible(false)} placement="center" className={kanit.className} isDismissable={false} isKeyboardDismissDisabled={true} >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">{data?.name}</ModalHeader>
          <ModalBody>
            <div className="flex flex-col w-full">

            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}
