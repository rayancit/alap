import React from 'react'
import Flex from './Flex'
import Sidebar from '../Sidebar'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
    return (
        <Flex className={" h-screen gap-x-6"}>
            <Sidebar />
            <Flex className={"py-3 flex-grow flex-wrap gap-4"}>
                <Outlet />
            </Flex>
        </Flex>
    )
}

export default RootLayout