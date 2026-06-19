import { AlertTriangleIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function Warning(props: { children?: React.ReactNode }) {
    return (
        <div className="flex justify-center items-center ">
            <Card className="border shadow-none p-8 pb-4">
                <CardContent className="flex flex-col justify-center items-center ">
                    <AlertTriangleIcon className="w-16 h-16" strokeWidth={0.7} />
                    <div className="font-bold pb-4">Warning</div>
                    {props.children}
                </CardContent>
            </Card>
        </div>
    )
}
