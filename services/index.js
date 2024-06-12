const Contact = require('../schemas/contact');


const createNewContact = async (email = "", phoneNumber = "", precedence = "", linkedId = "") => {
    try {

        const newContact = new Contact()

        newContact.id = await Contact.countDocuments() + 1
        newContact.phoneNumber = phoneNumber
        newContact.email = email
        newContact.linkedId = linkedId
        newContact.linkPrecedence = precedence
        newContact.deletedAt = null

        await newContact.save()

    } catch (error) {
        console.log(error)
        return null
    }

};

const turnIntoSecondary = async (primaryId = "", secondaryId = "") => {
    try {

        await Contact.findOneAndUpdate({ id: secondaryId }, {
            $set: {
                linkPrecedence: 'secondary',
                linkedId: primaryId
            }
        }, { new: true })

    } catch (error) {
        console.log(error)
        return null
    }

};

module.exports = {
    createNewContact,
    turnIntoSecondary
}