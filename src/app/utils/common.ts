import moment from 'moment';
import { BeneficiaryTypes } from './constants';

export interface DateInfo {
  year: number;
  month: number;
  day: number;
}

export interface DisplayOption {
  isReviewPage: boolean
  config: DisplayOptionConfig
}

export interface DisplayOptionConfig {
  reviewPage: DisplayOptionConfigContent
  inputPage: DisplayOptionConfigContent
}

export interface DisplayOptionConfigContent {
  headerText: string
  description: string
}

export type BeneficiaryFormData = BeneficiaryFormDataElement[]

export interface BeneficiaryFormDataElement {
  type: BeneficiaryTypes
  details: HumarnBeneficiaryFormData | TrustBeneficiaryFormData
}

export interface HumarnBeneficiaryFormData {
  firstName: string
  middleName?: string
  lastName: string
  dateOfBirth: DateInfo
  percentageAssigned: number
}

export interface TrustBeneficiaryFormData {
  percentageAssigned: number
  trustName: string
  established: DateInfo
}

export function formatCustomDate(date: DateInfo): string {
  const formattedDate = moment({
    year: date.year,
    month: date.month - 1, // Months in Moment.js are zero-based (0-11)
    day: date.day,
  });

  return formattedDate.format('MMM D, YYYY');
}

export type MonthEntry = [string, string];
