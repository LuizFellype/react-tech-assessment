/**
 * @jest-environment jsdom
 */
import {
    QueryClient as BaseQueryClient,
    QueryClientProvider as BaseQueryClientProvider,
} from "@tanstack/react-query";
import { waitFor, renderHook, act } from "@testing-library/react"
import { PropsWithChildren } from "react";
import { useManageUsersList } from "../useManageUsersList";

const getWrapper = () => {
    const queryClient = new BaseQueryClient({
        defaultOptions: {
            queries: {
                retry: false, // Disable retries in tests
            },
        },
    })

    const wrapper = ({ children }: PropsWithChildren) => <BaseQueryClientProvider client={queryClient}>{children}</BaseQueryClientProvider>

    return { wrapper };
}

describe("useManageUsersList", () => {
    test('should return initial loading state', async () => {
        const { result } = renderHook(() => useManageUsersList(), getWrapper());

        const { users, isLoading } = result.current;

        expect(isLoading).toBeTruthy();
        expect(users).toBe(undefined);
    })

    test('should return first page data after success', async () => {
        const { result } = renderHook(() => useManageUsersList(), getWrapper());

        expect(result.current.isLoading).toBe(true);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        
        expect(result.current.isLoading).toBe(false);
        expect(result.current.users).toBeDefined();
    })
    
    test('should return second page once pagination is set', async () => {
        const { result } = renderHook(() => useManageUsersList(), getWrapper());

        expect(result.current.isLoading).toBe(true);

        await new Promise(resolve => setTimeout(resolve, 500));

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.users).toBeDefined();
        
        
        // Set second page
        await act(() => {
            result.current.handlePagination(2);
        })
        await waitFor(() => expect(result.current.isLoading).toBe(true));
        
        await new Promise(resolve => setTimeout(resolve, 500));
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

    })

    test('should filter Miles from previous page', async () => {
        const { result } = renderHook(() => useManageUsersList(), getWrapper());

        expect(result.current.isLoading).toBe(true);

        await new Promise(resolve => setTimeout(resolve, 500));
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        
        expect(result.current.isLoading).toBe(false);
        expect(result.current.users?.[0].id).toBe(1);

        // Go to next page
        await act(() => {
            result.current.handlePagination(2);
        })
        await waitFor(() => expect(result.current.isLoading).toBe(true));
        
        await new Promise(resolve => setTimeout(resolve, 500));
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });
        expect(result.current.users?.[0].id).toBe(14);
        expect(result.current.filteredUsers).toBeUndefined();
        
        // Seaching for Miles
        await new Promise(resolve => setTimeout(resolve, 500));
        await act(() => {
            result.current.handleFilter('first_name')('Miles');
        })
        await waitFor(() => {
            expect(result.current.filteredUsers?.length).toBe(1);
        });
        
        expect(result.current.filteredUsers?.[0]?.id).toBe(4);
    })
})