'use client'

import { JutgeApiClient } from './jutge_api_client'

const jutge = new JutgeApiClient()

jutge.clientTTLs.set('problems.getAllAbstractProblems', 300)
jutge.clientTTLs.set('problems.getAllProblems', 300)

export default jutge
