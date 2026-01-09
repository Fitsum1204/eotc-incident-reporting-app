import IncidentReportForm from '@/components/shared/IncidentReportForm'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

const page = async () => {
  const session = await auth()
  if (!session) redirect('/')
  return (
    <div className='flex flex-col justify-center items-center'>
      <h1 className='heading'>Report  Incidents</h1>
      <IncidentReportForm />
    </div>
  )
}

export default page
