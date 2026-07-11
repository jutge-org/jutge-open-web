'use client'

import {
    fetchAdminDashboardZombies,
    adminFatalizeIEs,
    adminFatalizePendings,
    adminResubmitIEs,
    adminResubmitPendings,
} from '@/lib/administrator/client'
import SimpleSpinner from '@/components/administrator/SimpleSpinner'
import { AudioLinesIcon, ChevronDownIcon, GhostIcon, RotateCwIcon, SkullIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Zombies } from '@/lib/jutge_api_client'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import Widget from '@/components/administrator/dashboard/Widget'

export default function ZombiesWidget() {
    //

    const router = useRouter()

    const [data, setData] = useState<Zombies | null>(null)

    async function fetchData() {
        setData(await fetchAdminDashboardZombies())
    }

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 10 * 1000)
        return () => clearInterval(interval)
    }, [])

    function resubmitIEs() {
        void adminResubmitIEs()
        toast.success(`Resubmitting IEs...`)
        setInterval(fetchData, 1000)
    }

    function resubmitPendings() {
        void adminResubmitPendings()
        toast.success(`Resubmitting Pendings...`)
        setInterval(fetchData, 1000)
    }

    function fatalizeIEs() {
        void adminFatalizeIEs()
        toast.success(`Fatalizing IEs...`)
        setInterval(fetchData, 1000)
    }

    function fatalizePendings() {
        void adminFatalizePendings()
        toast.success(`Fatalizing Pendings...`)
        setInterval(fetchData, 1000)
    }

    const viewIEs = () => {
        router.push('/administrator/queue?view=internal-errors')
    }

    const viewPendings = () => {
        router.push('/administrator/queue?view=pendings')
    }

    const actions = (
        <>
            {data && data.ies + data.pendings > 0 && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="px-2" size="sm">
                            <ChevronDownIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {data.ies > 0 && (
                            <>
                                <DropdownMenuItem onClick={viewIEs}>
                                    <AudioLinesIcon />
                                    View IEs
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={resubmitIEs}>
                                    <RotateCwIcon />
                                    Resubmit IEs
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={fatalizeIEs}>
                                    <SkullIcon />
                                    Fatalize IEs
                                </DropdownMenuItem>
                            </>
                        )}

                        {data.pendings > 0 && (
                            <>
                                <DropdownMenuItem onClick={viewPendings}>
                                    <AudioLinesIcon />
                                    View Pendings
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={resubmitPendings}>
                                    <RotateCwIcon />
                                    Resubmit Pendings
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={fatalizePendings}>
                                    <SkullIcon />
                                    Fatalize Pendings
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </>
    )

    const content = (
        <div className="h-full w-full flex flex-col items-end gap-0">
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>Internal errors</TableCell>
                        <TableCell className="text-end">{data ? data.ies : <SimpleSpinner />}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Pendings</TableCell>
                        <TableCell className="text-end">{data ? data.pendings : <SimpleSpinner />}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )

    return <Widget icon=<GhostIcon size={18} /> title="Zombi submissions" content={content} actions={actions} />
}
