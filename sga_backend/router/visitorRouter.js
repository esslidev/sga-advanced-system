import express from 'express'

import visitorController from '../controllers/visitorController.js'


const visitorRouter = express.Router()

// Define the routes
visitorRouter.get('/get-visitor', visitorController.getVisitor)
visitorRouter.get('/get-visitors', visitorController.getVisitors)
visitorRouter.post('/add-visitor', visitorController.addVisitor)
visitorRouter.put('/update-visitor', visitorController.updateVisitor)
visitorRouter.delete('/delete-visitor', visitorController.deleteVisitor)

export default visitorRouter