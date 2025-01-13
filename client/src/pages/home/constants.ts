import { styled } from '@mui/system'
import { Box } from '@mui/material'
import wicrecend from '@/assets/images/wicrecend.jpg'

//Home Rotation Chart
export const images = [wicrecend]

export const services = [
    {
        title: 'Manual Test',
        description: 'Azure Portal Functional Testing',
        //icon: <ChatIcon />,
        link: '/Manual',
    },
    {
        title: 'Performance Test',
        description: 'Stress testing for Azure cache',
        //icon: <ChatIcon />,
        link: '/Performance',
    },
    {
        title: 'Automation Test',
        description: 'Automated Testing of Azure Functions',
        //icon: <ChatIcon />,
        link: '/Automation',
    },
    {
        title: 'ALT Test ',
        description: 'ALT',
        //icon: <ChatIcon />,
        link: '/ALT',
    },
    {
        title: 'BVT Test',
        description: 'Azure Portal Page Display Testing',
        //icon: <ChatIcon />,
        link: '/BVT',
    },
    {
        title: 'AOF Test',
        description: 'AOF',
        //icon: <ChatIcon />,
        link: '/AOF',
    },
]

export const Hero = styled(Box)({
    height: '93vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
})

export const Overlay = styled(Box)<{ visible: boolean }>(({ visible }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: visible ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
    transition: 'background-color 0.3s ease',
}))

export const ImageWrapper = styled(Box)<{ shift: number }>(({ shift }) => ({
    position: 'absolute',
    width: '100%',
    height: '100%',
    transition: 'transform 0.5s ease',
    transform: `translateX(${shift * 100}%)`,
}))

export const Indicator = styled(Box)({
    position: 'absolute',
    bottom: 16,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
})

export const IndicatorDot = styled(Box)<{ active: boolean }>(({ active }) => ({
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: active ? '#fff' : 'rgba(255, 255, 255, 0.5)',
    margin: '0 5px',
}))
