import styled from '@mui/material/styles/styled';
import { Tabs } from '@mui/base/Tabs';
import { TabsList as BaseTabsList } from '@mui/base/TabsList';
import { TabPanel as BaseTabPanel } from '@mui/base/TabPanel';
import { buttonClasses } from '@mui/base/Button';
import { Tab as BaseTab, tabClasses } from '@mui/base/Tab';

const TabsList = styled(BaseTabsList)`
  background-color: rgba(145, 158, 171, 0.16);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
`;

const Tab = styled(BaseTab)`
  color: #637381;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: transparent;
  width: 100%;
  padding: 10px 12px;
  margin: 6px;
  border: none;
  border-radius: 7px;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: rgba(145, 158, 171, 0.16);
  }

  &:focus {
    outline: 3px solid rgba(145, 158, 171, 0.24);
  }

  &.${tabClasses.selected} {
    background-color: #fff;
    color: #000000;
  }

  &.${buttonClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TabPanel = styled(BaseTabPanel)`
  width: 100%;
  background: transparent;
`;

export { Tabs as Root, TabsList as List, TabPanel as Panel, Tab as Item };
