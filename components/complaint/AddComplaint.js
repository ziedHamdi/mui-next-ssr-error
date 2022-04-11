import React from 'react';

import {useRouter} from 'next/router'

import {useMutation} from "@apollo/client";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import gql from "graphql-tag";
import {useTranslation} from "next-i18next";

const sx = {
    add: {
        textTransform: 'none',
    },

}

const ADD_COMPLAINT = gql`
	mutation complaintCreate($entityId:String, $title: String, $desc: String, $categoryName : String) {
    complaintCreate(record:{entityId:$entityId, title:$title, desc:$desc, categoryName:$categoryName}){
    	recordId, 
    	record{
    		_id, 
				entityId,
				entityGroupId,
				user {
					userId,
					userName,
					roleInShop
				},
				title,
				desc,
				mainAttachmentIndex,
				createdAt,
				updatedAt
			}
		}
  }`

export default function AddComplaint(props) {
    const [complaintCreate] = useMutation(ADD_COMPLAINT, {
        async update(cache, {data: {complaintCreate}}) {
            await router.push(`/request/${complaintCreate.record._id}/edit`)
        }
    })
    const router = useRouter()
    const {t} = useTranslation('header')
    // const {client, router, category} = props
    //FIXME const {entityId} = from router (optional)
    const {entityId, buttonSX} = props


    return (
        <Button variant="contained" color="primary" onClick={buildOnCreateClicked(complaintCreate, entityId)}
                sx={[sx.add, buttonSX]}>
            <Typography variant="body1">{t('header.startRequest')}</Typography>
        </Button>
    )

    function buildOnCreateClicked(eid) {
        return (e) => {
            const created = complaintCreate({
                variables: {
                    entityId: eid,
                    categoryName: props.category
                }
            })

        }
    }

}
