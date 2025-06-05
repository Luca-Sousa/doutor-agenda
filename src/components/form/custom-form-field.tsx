/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, LucideIcon } from "lucide-react";
import React, { HTMLInputTypeAttribute } from "react";
import { Matcher } from "react-day-picker";
import { Control } from "react-hook-form";
import { NumericFormat, PatternFormat } from "react-number-format";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export enum FormFieldType {
  INPUT = "input",
  PHONE_INPUT = "phoneInput",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  NUMERICFORMAT = "NumericFormat",
  POPOVERCALENDER = "popover",
}

interface CustomFormFieldPros {
  control: Control<any>;
  fieldType: FormFieldType;
  name: string;
  label: string;
  typeInput?: HTMLInputTypeAttribute | undefined;
  placeholder?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  disabled?: boolean;
  disabledCalendar?: Matcher | Matcher[] | undefined;
}

const RenderField = ({
  field,
  props,
}: {
  field: any;
  props: CustomFormFieldPros;
}) => {
  const {
    typeInput,
    placeholder,
    icon,
    fieldType,
    children,
    disabled,
    disabledCalendar,
  } = props;
  const Icon = icon;

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex items-center rounded-md border">
          {Icon && <Icon className="text-primary/70 ml-3 size-5" />}

          <FormControl>
            <Input
              type={typeInput}
              placeholder={placeholder}
              {...field}
              className="h-11 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </FormControl>
        </div>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <div className="flex items-center rounded-md border">
            {Icon && <Icon className="text-primary/70 ml-3 size-5" />}

            <PatternFormat
              format="(##) #####-####"
              mask="_"
              placeholder={placeholder}
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value.value);
              }}
              customInput={Input}
              className="h-11 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </FormControl>
      );
    case FormFieldType.SELECT:
      return (
        <Select
          onValueChange={field.onChange}
          defaultValue={field.value}
          disabled={disabled}
        >
          <FormControl>
            <SelectTrigger className="focus:!border-input !h-11 w-full cursor-pointer focus:!ring-0 focus:!ring-offset-0">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>

          <SelectContent className="shad-select-content">
            {children}
          </SelectContent>
        </Select>
      );
    case FormFieldType.NUMERICFORMAT:
      return (
        <FormControl>
          <div className="flex items-center rounded-md border">
            {Icon && <Icon className="text-primary/70 ml-3 size-5" />}

            <NumericFormat
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value.floatValue);
              }}
              decimalScale={2}
              fixedDecimalScale
              decimalSeparator=","
              allowNegative={false}
              allowLeadingZeros={false}
              thousandSeparator="."
              disabled={disabled}
              customInput={Input}
              prefix="R$ "
              className="h-11 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </FormControl>
      );
    case FormFieldType.POPOVERCALENDER:
      return (
        <Popover>
          <PopoverTrigger asChild className="cursor-pointer">
            <FormControl>
              <Button
                variant={"outline"}
                disabled={disabled}
                className={cn(
                  "focus-visible:border-border h-11 w-full justify-start text-left font-normal focus-visible:ring-0 focus-visible:ring-offset-0",
                  !field.value && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="text-primary/70 size-5" />
                {field.value ? (
                  format(field.value, "PPP", { locale: ptBR })
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
              disabled={disabledCalendar}
              initialFocus
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      );

    default:
      break;
  }
};

const CustomFormField = (props: CustomFormFieldPros) => {
  const { control, name, label } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>{label}</FormLabel>
          <RenderField field={field} props={props} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
