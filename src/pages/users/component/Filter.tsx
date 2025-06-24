import { Input } from 'antd';
import { useDebounce } from 'hooks/useDebounce';
import { useEffect, useState } from 'react';

type ProductListFiltersProps = {
    onChange: (search: string) => void;
    id?: string;
};

export default function UsersListFilter({
    onChange,
    id
}: ProductListFiltersProps) {
    const [search, setSearch] = useState<string>('');
    const debouncedSearch = useDebounce(search);

    useEffect(() => {
        onChange(debouncedSearch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    return (
        <div className="flex flex-row gap-2">
            <Input
                placeholder='Search'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                id={id}
            />
        </div>
    );
}