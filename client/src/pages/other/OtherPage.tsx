import React from 'react'
import NavPage from '../../layout/NavPage'
import { IconDatabaseImport } from '@tabler/icons-react'
import { IconStackMiddle } from '@tabler/icons-react'

const leftLinks = [
    {
        title: 'Insert Data',
        path: '/tools/insert',
        alert: 'Insert data in cache',
        icon: <IconDatabaseImport stroke={2} />,
    },
    {
        title: 'Find Median',
        path: '/tools/median',
        alert: 'Find the median of all excel in this path',
        icon: <IconStackMiddle stroke={2} />,
    },
    {
        title: 'Compare Testplan',
        path: '/tools/compare',
        alert: '',
        icon: <IconStackMiddle stroke={2} />,
    },
]

const OtherPage: React.FC = () => {
    return <NavPage links={leftLinks} defaultPath="/tools/insert" />
}

export default OtherPage
