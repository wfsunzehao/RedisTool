import React, { useMemo } from 'react'
import { IconChartLine } from '@tabler/icons-react'
import { IconHandClick } from '@tabler/icons-react'
import { IconAlt } from '@tabler/icons-react'
import { IconDeviceDesktopAnalytics } from '@tabler/icons-react'
import NavPage from '../../layout/NavPage'
import { useLocation } from 'react-router-dom'

// Link to the left navigation bar
const leftLinks = [
    { title: 'Manual', path: '/tests/man', icon: <IconHandClick stroke={2} /> },
    {
        title: 'BVT',
        path: '/tests/bvt',
        alert: 'Customers recommend manually creating the cache for bvt tests',
        icon: <IconDeviceDesktopAnalytics stroke={2} />,
    },
    {
        title: 'Performance',
        path: '/tests/perf',
        icon: <IconChartLine stroke={2} />,
        subLinks: [
            { title: 'Create', path: '/tests/perf', count: 1 },
            { title: 'InsertSingleTask', path: '/tests/benchmark', count: 2 },
            { title: 'ExecutionTask', path: '/tests/routine', count: 3 },
            { title: 'Statistics', path: '/tests/statistics', count: 4 },
            { title: 'Insertexcel', path: '/tests/TxtExcelMerger', count: 5 },
        ],
    },
    { title: 'ALT', path: '/tests/alt', icon: <IconAlt stroke={2} /> },
]

// Homepage component
const CreatePage: React.FC = () => {
    const location = useLocation()

    const contentWidth = useMemo(() => {
        const customWidths: Record<string, string> = {
            '/tests/benchmark': '100%',
            '/tests/statistics': '100%',
        }
        return customWidths[location.pathname] || '40%'
    }, [location.pathname]) //

    return <NavPage links={leftLinks} defaultPath="/tests/man" contentWidth={contentWidth} />
}

export default CreatePage
