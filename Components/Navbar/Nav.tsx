import React from 'react'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar, Chip, Divider, DropdownSection } from "@heroui/react";
import { signOut } from 'next-auth/react';
import { useSession, signIn } from "next-auth/react"
import { Prompt } from "next/font/google";
import Link from 'next/link';
import { ThemeSwitcher } from '../Theme';

const kanit = Prompt({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] });


export default function NavbarComponent() {
    const { data: session } = useSession()

    return (
        <div className={`${kanit.className} sticky top-0 z-10`}>
            <Navbar isBordered maxWidth="2xl" isBlurred={false}>
                <NavbarContent justify="start">
                    <NavbarBrand className="mr-4">
                        <Link href='/'><p className="sm:block mr-2 font-bold text-inherit">Scoring <span className='from-[#FF1CF7] to-[#b249f8] bg-clip-text text-transparent bg-gradient-to-b inline'>Classroom</span></p></Link>
                        <Chip isDisabled size="sm" variant="flat">{process.env.NEXT_PUBLIC_VER || 'v2.7.10'}</Chip>
                        <Link href='/blog/v2.1.0' className='relative max-w-fit min-w-min items-center justify-between box-border whitespace-nowrap px-1 h-6 text-sm font-sm ml-3 rounded-full text-primary-600 hidden sm:flex bg-default-200/50 border-1 hover:bg-default-200/80 border-default-400/50 cursor-pointer'>
                        <span className="flex-1 px-2 text-foreground text-xs">Scoring Classroom v2.2.0&nbsp;<span aria-label="emoji" role="img">🔥</span></span>
                        </Link>
                    </NavbarBrand>
                </NavbarContent>

                <NavbarContent as="div" className="items-center" justify="end">
                    <ThemeSwitcher />
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
                        {session?.user?.usertype === 0 ?
                            <DropdownMenu aria-label="Profile Actions" variant="flat">
                                <DropdownSection showDivider aria-label="Profile & Actions">
                                <DropdownItem key="profile" className="h-14 gap-2">
                                    <p className="font-semibold">{session?.user?.name || undefined} <Chip color="warning" variant="bordered" size="sm">{session?.user?.usertype === 0 ? "Teacher" : "TA"}</Chip></p>
                                    <p className="font-light">{session?.user?.email || undefined}</p>
                                </DropdownItem>
                                </DropdownSection>
                                <DropdownItem key="admin" onPress={() => window.open("/admin/users", "_blank")}>
                                    จัดการผู้ใช้
                                </DropdownItem>
                                <DropdownItem key="logout" color="danger" onPress={() => signOut({ callbackUrl: '/login' })}>
                                    ออกจากระบบ
                                </DropdownItem>
                                
                            </DropdownMenu>
                            :
                            <DropdownMenu aria-label="Profile Actions" variant="flat">
                                <DropdownSection showDivider aria-label="Profile & Actions">
                                <DropdownItem key="profile" className="h-14 gap-2">
                                    <p className="font-semibold">{session?.user?.name || undefined} <Chip color="warning" variant="bordered" size="sm">{session?.user?.usertype === 0 ? "Teacher" : "TA"}</Chip></p>
                                    <p className="font-light">{session?.user?.email || undefined}</p>
                                </DropdownItem>
                                </DropdownSection>
                                <DropdownItem key="logout" color="danger" onPress={() => signOut({ callbackUrl: '/login' })}>
                                    ออกจากระบบ
                                </DropdownItem>
                                
                            </DropdownMenu>
                        }
                    </Dropdown>

                </NavbarContent>

            </Navbar>
        </div>
    )
}
