import { Icon } from '@iconify/react';
import { TableRow, TableCell, Typography, Stack, Button, Collapse } from '@mui/material';
import { useState } from 'react';
import { AdditionalCitoListType } from 'src/services/settings-cito/schemas/type';

interface RowAdditionalCitoProps {
  data: AdditionalCitoListType[];
  cito_type: string;
  onClickAdditional?: any;
  onClickAttachment?: any;
}

export function RowAdditionalCito({
  data,
  cito_type,
  onClickAdditional,
  onClickAttachment,
}: RowAdditionalCitoProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleExpanded = (id: number) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      {data.map((item) =>
        item.details.map((itm, idx) => {
          const isExpanded = expanded[item.id] ?? false;
          const isMainRow = idx === 0;

          return (
            <TableRow
              key={`${item.id}-${idx}`}
              hover
              onClick={() => {
                if (isMainRow) toggleExpanded(item.id);
              }}
              sx={{ cursor: isMainRow ? 'pointer' : 'default' }}
            >
              {(isExpanded || isMainRow) && (
                <>
                  <TableCell>
                    <Typography sx={{ ml: idx === 0 ? 0 : 1.5 }} fontSize={14}>
                      {itm.company_name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ ml: idx === 0 ? 0 : 1.5 }} fontSize={14}>
                      {itm.quota || 0}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ ml: idx === 0 ? 0 : 1.5 }} fontSize={14}>
                      {item.po_number || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {isMainRow && (
                      <Stack direction="row" gap={1}>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent toggle on button click
                            onClickAdditional?.(
                              {
                                details: item.details,
                                documents: item.documents,
                                po_number: item.po_number,
                                id: item.id,
                              },
                              cito_type
                            );
                          }}
                          sx={{ minWidth: 2, p: 0, pl: 1 }}
                          startIcon={
                            <Icon
                              icon="material-symbols:edit-outline"
                              width="20"
                              height="20"
                              color="black"
                            />
                          }
                        />
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            onClickAttachment(item.documents);
                          }}
                          sx={{ minWidth: 2, p: 0, pl: 1 }}
                          startIcon={
                            <Icon
                              icon="mdi:attachment-vertical"
                              width="20"
                              height="20"
                              color="black"
                            />
                          }
                        />
                      </Stack>
                    )}
                  </TableCell>
                </>
              )}
            </TableRow>
          );
        })
      )}
    </>
  );
}
