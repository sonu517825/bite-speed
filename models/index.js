const Contact = require('../schemas/contact');
const HttpError = require('../error/httpError');
const Services = require('../services/index')

const identify = async (body = {}) => {
    try {

        let { email, phoneNumber } = body
        if (!email && !phoneNumber) {
            throw new HttpError("email or phoneNumber is required.", 400)
        }

        let allEmails = await Contact.find({ email })
        let allPhoneNumbers = await Contact.find({ phoneNumber })

        // case 1: if no existing contacts against an incoming request

        if (phoneNumber && email && allEmails.length === 0 && allPhoneNumbers.length === 0) {
            await Services.createNewContact(email, phoneNumber, 'primary', null)
        }

        // case 2: is secondary contact need to create 

        if (phoneNumber && allEmails.length !== 0 && allPhoneNumbers.length === 0) { // email but not phone

            let linkedId = allEmails.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).filter(o => o.linkPrecedence === 'primary')

            if (linkedId.length === 0) {
                linkedId = allEmails.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).filter(o => o.linkedId !== null)
            }

            if (linkedId.length === 0) {
                throw new HttpError("Server not able to decide linkedId.", 500)
            }

            await Services.createNewContact(email, phoneNumber, 'secondary', linkedId[0].id)
        }

        if (email && allEmails.length === 0 && allPhoneNumbers.length !== 0) { // phone but not email

            let linkedId = allPhoneNumbers.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).filter(o => o.linkPrecedence === 'primary')

            if (linkedId.length === 0) {
                linkedId = allPhoneNumbers.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).filter(o => o.linkedId !== null)
            }

            if (linkedId.length === 0) {
                throw new HttpError("Server not able to decide linkedId.", 500)
            }

            await Services.createNewContact(email, phoneNumber, 'secondary', linkedId[0].id)
        }

        // case 3: Can primary contacts turn into secondary

        let isEmailPrimary = allEmails.filter(o => o.linkPrecedence === 'primary')
        let isPhonePrimary = allPhoneNumbers.filter(o => o.linkPrecedence === 'primary')

        if (isEmailPrimary.length > 0 && isPhonePrimary.length > 0 && isEmailPrimary[0].id !== isPhonePrimary[0].id) {
            const data = [isEmailPrimary[0], isPhonePrimary[0]].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            await Services.turnIntoSecondary(data[0].id, data[1].id)
        }

        let allContacts = await Contact.find({ $or: [{ email }, { phoneNumber }] });
        const allIds = [...new Set([...allContacts.map(o => o.id), ...allContacts.map(o => o.linkedId)])].filter(e => e !== null)
        allContacts = [...allContacts, ...await Contact.find({ $or: [{ linkedId: { $in: allIds } }, { id: { $in: allIds } }] })];

        // unknown case

        if ((allContacts.length === 0 && phoneNumber && allEmails.length === 0 && allPhoneNumbers.length === 0) || (allContacts.length === 0 && email && allEmails.length === 0 && allPhoneNumbers.length === 0)) {
            throw new HttpError("This case is not clear. You must provide at least an email or phone number that is already registered, or both new ones.", 400);
        }

        let linkedId = allContacts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).filter(o => o.linkPrecedence === 'primary')

        if (linkedId.length === 0) {
            linkedId = allContacts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).filter(o => o.linkedId !== null)
        }

        if (linkedId.length === 0) {
            throw new HttpError("Server not able to decide linkedId.", 500)
        }

        const _return = {
            primaryContactId: linkedId[0].id,
            emails: [...new Set(allContacts.map(o => o.email))],
            phoneNumbers: [...new Set(allContacts.map(o => o.phoneNumber))],
            secondaryContactIds: [...new Set(allContacts.filter(o => o.linkPrecedence === 'secondary').map(o => o.id))],
        }

        return {
            contact: _return
        }
    } catch (error) {
        throw new HttpError(error.message || "Something went wrong.", error.statusCode || 500)
    }
};

module.exports = {
    identify
}