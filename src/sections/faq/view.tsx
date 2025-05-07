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
import { useState } from 'react';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';
import { DashboardContent } from 'src/layouts/dashboard';

export default function FAQView() {
  const [search, setSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);

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
              <Accordion
                expanded={expandedCategories.includes('general')}
                onChange={() => handleCategoryChange('general')}
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
                    expandedCategories.includes('general') ? (
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
                      General
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                  {/* Nested Question Accordions */}
                  <Accordion
                    expanded={expandedQuestions.includes('question1')}
                    onChange={() => handleQuestionChange('question1')}
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
                          bgcolor: 'background.paper',
                          mb: 1,
                          borderTopLeftRadius: 1,
                        },
                      },
                      '& .MuiAccordionDetails-root': {
                        bgcolor: 'background.paper',
                      },
                    }}
                  >
                    <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                      <Typography color="black" fontWeight="bold">
                        What is Sismaya?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography color="black">
                        Sismaya is a comprehensive management system that helps organizations
                        streamline their operations.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion
                    expanded={expandedQuestions.includes('question2')}
                    onChange={() => handleQuestionChange('question2')}
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
                          bgcolor: 'background.paper',
                          mb: 1,
                          borderTopLeftRadius: 1,
                        },
                      },
                      '& .MuiAccordionDetails-root': {
                        bgcolor: 'background.paper',
                      },
                    }}
                  >
                    <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                      <Typography color="black" fontWeight="bold">
                        How do I get started?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography color="black">
                        Getting started is easy. Simply register an account and follow our
                        onboarding process.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </DashboardContent>
  );
}
