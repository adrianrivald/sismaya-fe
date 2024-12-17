import * as React from 'react';
import { createContext } from '../../../../utils/create.context';
import { _clientComp } from '../../client-company/sample/data';

interface MasterDataContextValue {
  addClient: (data: any) => void;
  addInternal: (data: any) => void;
  addUser: (data: any) => void;
  clientList: any[];
  setClientList: React.Dispatch<React.SetStateAction<any>>;
  internalList: any[];
  setInternalList: React.Dispatch<React.SetStateAction<any>>;
  userList: any[];
  setUserList: React.Dispatch<React.SetStateAction<any>>;
  editInternal: (data: any) => void;
  editClient: (data: any) => void;
}

const [useMasterData, ClientProvider] = createContext<MasterDataContextValue>({
  name: 'MasterData',
});

export { useMasterData };

export function MasterDataProvider(props: React.PropsWithChildren) {
  const [clientList, setClientList] = React.useState<any[]>(() => {
    // Load initial value from localStorage or default to null
    const savedClientList = localStorage.getItem('clientList');
    return savedClientList ? JSON.parse(savedClientList) : _clientComp;
  });
  const [internalList, setInternalList] = React.useState<any[]>([]);
  const [userList, setUserList] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Save user data to localStorage when user state changes
    if (clientList?.length > 1) {
      localStorage.setItem('clientList', JSON.stringify(clientList));
    } else {
      localStorage.removeItem('clientList');
    }
  }, [clientList]);

  async function addClient(data: any) {
    setClientList([...clientList, { ...data }]);
  }

  async function editClient(data: any) {
    setClientList(clientList?.map((item) => (item.id === data?.id ? { ...item, ...data } : item)));
  }

  React.useEffect(() => {
    console.log(clientList, 'clientList');
  }, [clientList]);

  async function addInternal(data: any) {
    setInternalList([...internalList, { ...data }]);
  }

  async function editInternal(data: any) {
    setInternalList(internalList?.map((item) => (item.id === data?.id ? { ...item, data } : item)));
  }

  async function addUser(data: any) {
    setUserList([...userList, { ...data }]);
  }

  return (
    <ClientProvider
      value={{
        clientList,
        setClientList,
        addClient,
        internalList,
        setInternalList,
        addInternal,
        userList,
        setUserList,
        addUser,
        editInternal,
        editClient,
      }}
    >
      {props?.children}
    </ClientProvider>
  );
}
