
import { useIntl } from "react-intl";
import {
    Table,
    TableColumnType,
    Image
} from "antd";

import { useManageUsersList } from "hooks/useManageUsersList";
import { UserProfileData } from "services/userProfile/interface";
import UsersListFilter from "./Filter";
import "./List.css";

type DataIndex = keyof UserProfileData;

export const UsersList = () => {
    const {
        isLoading, handleFilter,
        filteredUsers, users, pagination, limit, total, handlePagination
    } = useManageUsersList()

    const columns = useGetColumns(handleFilter);

    return (
        <Table
            pagination={{
                current: pagination, pageSize: limit,
                total, onChange: handlePagination
            }}
            loading={isLoading}
            dataSource={filteredUsers || users || []}
            columns={columns}
        />
    );
}


const useGetColumns = (handleFilter: (keyToFilter: keyof UserProfileData) => (search: string) => void) => {
    const {
        firstName,
        lastName,
        image,
        email
    } = useGetTranslations()

    const getTitleWithSearch = (title: string, dataIndex: DataIndex): TableColumnType<UserProfileData> => ({
        title: () => {
            return (
                <div className="title-search">
                    <span>{title}</span>

                    <UsersListFilter id={`search-${dataIndex}`} onChange={handleFilter(dataIndex)} />
                </div>
            )
        }
    });

    return [
        {
            title: image,
            key: 'avatar',
            render: (user: UserProfileData) => {
                const alt = `${user.name} ${image}`
                return <Image src={user.avatar} alt={alt} loading="lazy" className="user-avatar" width={75} height={75} />
            }
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            ...getTitleWithSearch(firstName, 'first_name'),
            dataIndex: 'first_name',
            key: 'firstName',
        },
        {
            ...getTitleWithSearch(lastName, 'last_name'),
            dataIndex: 'last_name',
            key: 'lastName',
        },
        {
            title: email,
            dataIndex: 'email',
            key: 'email',
            sorter: sortByKey('email'),
        },
    ]
}

const useGetTranslations = () => {
    const { formatMessage } = useIntl();

    const firstName = formatMessage({
        id: "page.userProfile.form.basicInfo.first_name",
    })
    const lastName = formatMessage({
        id: "page.userProfile.form.basicInfo.last_name",
    })
    const image = formatMessage({
        id: "page.userProfile.form.basicInfo.avatar",
    })
    const email = formatMessage({
        id: "page.userProfile.form.basicInfo.email",
    })

    return {
        firstName,
        lastName,
        image,
        email
    }
}
const sortByKey = (key: string) => (a: any, b: any) => {
    if (a[key] < b[key]) {
        return -1;
    }
    if (a[key] > b[key]) {
        return 1;
    }
    return 0;
}