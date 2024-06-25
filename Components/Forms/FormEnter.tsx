import React, { useState, useEffect } from 'react'
import { Autocomplete, AutocompleteItem, Avatar, Button, Input } from "@nextui-org/react";
import axios from 'axios';
import { SearchIcon } from '../Icons/SearchIcon';
import { Prompt } from "next/font/google";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });


export default function FormEnter(idcourse: any) {

    interface Students {
        stdid: string;
        name: string;
        image: string
    }

    const [dataUser, setDataUser] = useState<Students[]>([]);

    // useEffect(() => {
    //     getUser("0", idcourse.idcourse);
    // }, [])

    const getUser = async (stdid: string, idcourse: string) => {
        try {
            const data = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/score/getuser`,
                { stdid, idcourse },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': process.env.NEXT_PUBLIC_API_KEY
                    }
                });

            setDataUser(data.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error.message);
            } else {
                console.log('An unexpected error occurred');
            }
        }
    }

    // console.log("DATAUSER ", dataUser)
    const onInputChange = (value: string) => {
        console.log("Data input ", value)
        getUser(value, idcourse.idcourse);
    };



    return (
        <div>


                <Typography variant="h6" gutterBottom align="center">
                coming soon huff!!
                </Typography>

            {/* <form className={`flex flex-col gap-4 ${kanit.className}`}>
                <Autocomplete
                    defaultItems={dataUser}
                    inputProps={{
                        classNames: {
                            input: "ml-1",
                            inputWrapper: "h-[48px]",
                        },
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
                    }}
                    aria-label="Select an employee"
                    placeholder="กรุณากรอกรหัส"
                    popoverProps={{
                        offset: 5,
                        classNames: {
                            base: "rounded-large",
                            content: "p-1 border-small border-default-100 bg-background",
                        },
                    }}
                    startContent={<SearchIcon className="text-default-400" strokeWidth={2.5} size={20} width={15} height={15} />}
                    onInputChange={onInputChange}
                    variant="bordered"
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
                                    size="sm"
                                    variant="bordered"
                                >
                                    เลือก
                                </Button>
                            </div>
                        </AutocompleteItem>
                    )}
                </Autocomplete>
            </form> */}


        </div>
    )
}
