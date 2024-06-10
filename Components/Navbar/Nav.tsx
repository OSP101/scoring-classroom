import React from 'react'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Input, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar } from "@nextui-org/react";
import { signOut } from 'next-auth/react';
import { useSession, signIn } from "next-auth/react"
import { useRouter } from 'next/router'
import { Prompt } from "next/font/google";

const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });


export default function NavbarComponent() {
    const { data: session } = useSession()

    return (
        <div className={kanit.className}>
        <Navbar isBordered maxWidth="2xl">
            <NavbarContent justify="start">
                <NavbarBrand className="mr-4">
                    <p className="sm:block font-bold text-inherit">Scoring <span className='from-[#FF1CF7] to-[#b249f8] bg-clip-text text-transparent bg-gradient-to-b inline'>Classroom</span></p>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent as="div" className="items-center" justify="end">
                <Dropdown placement="bottom-end" className={kanit.className}>
                    <DropdownTrigger>
                        <Avatar
                            isBordered
                            as="button"
                            className="transition-transform"
                            color="secondary"
                            name={session?.user?.name || undefined}
                            size="sm"
                            src={session?.user?.image || `https://i.pravatar.cc/150?u=a042581f4e29026704d`}
                        />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem key="profile" className="h-14 gap-2">
                            <p className="font-semibold">{session?.user?.name || undefined}</p>
                            <p className="font-light">{session?.user?.email || undefined}</p>
                        </DropdownItem>
                        <DropdownItem key="logout" color="danger" onClick={() => signOut({ callbackUrl: '/login' })}>
                        ออกจากระบบ</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
        </Navbar>
        </div>
    )
}
