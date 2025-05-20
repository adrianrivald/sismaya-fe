import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';
import { DashboardContent } from 'src/layouts/dashboard';
import { useProductFAQ } from 'src/services/master-data/faq/use-faq-list';
import useDebounce from 'src/utils/use-debounce';
import { useAuth } from '../auth/providers/auth';

export default function FAQView() {
  const [search, setSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);
  const debouncedSearch = useDebounce(search, 1000);
  const { vendor } = useParams();
  const { user } = useAuth();
  const idCurrentCompany =
    user?.internal_companies?.find((item) => item?.company?.name?.toLowerCase() === vendor)?.company
      ?.id ?? 0;
  const { data: dataFAQ } = useProductFAQ({ search: debouncedSearch }, String(idCurrentCompany));
  const searchRef = useRef<HTMLInputElement>(null);

  const handleCategoryChange = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleQuestionChange = (question: string) => {
    setExpandedQuestions((prev) =>
      prev.includes(question) ? prev.filter((q) => q !== question) : [...prev, question]
    );
  };

  useEffect(() => {
    if (dataFAQ && dataFAQ?.length > 0) {
      searchRef.current?.focus();
    }
  }, [dataFAQ]);

  useEffect(() => {}, []);

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
            Frequently Asked Questions (FAQ)
          </Typography>
        </Box>
      </Box>
      <Card>
        <CardContent>
          <Grid container rowSpacing={3} columnSpacing={2}>
            <Grid item xs={12} md={12}>
              <FormControl fullWidth sx={{ mt: 3 }}>
                <TextField
                  sx={{ width: '100%' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgColor width={18} height={24} src="/assets/icons/ic-search.svg" />
                      </InputAdornment>
                    ),
                  }}
                  value={search}
                  placeholder="Search..."
                  onChange={(e) => setSearch(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12} spacing={2}>
              {dataFAQ?.map((item, index) => (
                <Box sx={{ mb: 3 }}>
                  <Accordion
                    key={index}
                    expanded={expandedCategories.includes(item.product_name)}
                    onChange={() => handleCategoryChange(item.product_name)}
                    sx={{
                      '&:before': { display: 'none' },
                      bgcolor: 'var(--grey-4, rgba(145, 158, 171, 0.1))',
                      borderRadius: 1.5,
                      mb: 2,
                      '& .MuiAccordionSummary-root': {
                        minHeight: 48,
                        bgcolor: 'transparent',
                        '&.Mui-expanded': {
                          bgcolor: 'transparent',
                          mb: 2,
                        },
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={
                        expandedCategories.includes(item.product_name) ? (
                          <Iconify icon="ic:baseline-minus" />
                        ) : (
                          <Iconify icon="ic:baseline-plus" />
                        )
                      }
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ width: '100%' }}
                      >
                        <Typography fontSize={18} fontWeight="bold" color="black">
                          {item.product_name}
                        </Typography>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 2 }}>
                      {item?.faq?.map(
                        (itm: { question: string; answer: string; id: number }, idx: number) => (
                          <Accordion
                            key={idx}
                            expanded={expandedQuestions.includes(itm.question + String(itm.id))}
                            onChange={() => handleQuestionChange(itm.question + String(itm.id))}
                            sx={{
                              '&:before': { display: 'none' },
                              mb: 1,

                              boxShadow: 'none',
                              bgcolor: 'transparent',
                              borderRadius: 1,
                              '& .MuiAccordionSummary-root': {
                                minHeight: 48,
                                bgcolor: 'transparent',
                                '&.Mui-expanded': {
                                  // bgcolor: 'background.paper',
                                  mb: 1,
                                  borderTopLeftRadius: 1,
                                },
                              },
                              '& .MuiAccordionDetails-root': {
                                // bgcolor: 'background.paper',
                              },
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                            >
                              <Typography color="black" fontWeight="bold">
                                {search
                                  ? itm.question
                                      .split(new RegExp(`(${search})`, 'gi'))
                                      .map((part, i) =>
                                        part.toLowerCase() === search.toLowerCase() ? (
                                          <Box component="span" key={i} sx={{ bgcolor: '#CCDEE5' }}>
                                            {part}
                                          </Box>
                                        ) : (
                                          part
                                        )
                                      )
                                  : itm.question}
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Box
                                dangerouslySetInnerHTML={{ __html: itm.answer }}
                                sx={{
                                  boxShadow: '9',
                                  p: 2,
                                  borderRadius: 1,
                                  bgcolor: 'white',
                                  '& img': {
                                    width: '200px',
                                    height: '200px',
                                    objectFit: 'cover',
                                    borderRadius: 1,
                                  },
                                  '& p': {
                                    m: 0,
                                    fontSize: 14,
                                    color: 'black',
                                  },
                                  '& ul': {
                                    m: 0,
                                    pl: 2.5,
                                    '& li': {
                                      fontSize: 14,
                                      color: 'black',
                                      mb: 1,
                                      '&:last-child': {
                                        mb: 0,
                                      },
                                    },
                                  },
                                }}
                              />
                            </AccordionDetails>
                          </Accordion>
                        )
                      )}
                    </AccordionDetails>
                  </Accordion>
                </Box>
              ))}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </DashboardContent>
  );
}
