"use client";

import { useEffect, useState } from "react";
import { FlagIcon, FlagIconCode } from "react-flag-kit";
import { Currency } from "iso-country-currency";
import { toast } from "sonner";
import type { Company } from "@/types/interfaces/company/company.interface";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Combobox } from "@/components/common/combobox/combobox";
import { ButtonSave } from "@/components/common/buttons/button-save";
import { companyUpdateCurrency } from "@/actions/companies/mutations/company.update-currency.action";

interface CompanyCurrencyProps {
  currencies: Currency[];
  isoCountryCurrency: string;
  company: Company;
}
export const CompanyCurrency = ({
  currencies,
  isoCountryCurrency,
  company,
}: CompanyCurrencyProps) => {
  const [isOpenCombobox, setIsOpenCombobox] = useState(false);
  const [currentValue, setCurrentValue] = useState(isoCountryCurrency);
  const [currency, setCurrency] = useState<Currency>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const currency = currencies.find(
      (currency) => currency.iso === currentValue
    );
    setCurrency(currency);
  }, [currentValue, currencies, isoCountryCurrency]);

  const isPreValidated = () => {
    return currency && currency.iso !== isoCountryCurrency;
  };
  const handleSave = async () => {
    if (!isPreValidated() || !currency) return;
    setIsLoading(true);

    company.iso = currentValue;
    company.country = currency.countryName ?? "";
    company.currency = currency?.currency;
    company.currencySymbol = currency?.symbol;

    const resp = await companyUpdateCurrency(company);
    setIsLoading(false);
    if (!resp.success) {
      toast.error("Error al actualizar la moneda: " + resp.message);
      return;
    }
    toast.success("Moneda actualizada.");
  };

  return (
    <Card className="card w-full md:w-1/2 ">
      <CardHeader>
        <Combobox
          data={currencies.map((currency) => ({
            label: currency.countryName,
            value: currency.iso,
          }))}
          labelSelect="Seleccione un pais"
          handleSelect={(value) => setCurrentValue(value)}
          isOpen={isOpenCombobox}
          setIsOpen={() => setIsOpenCombobox(!isOpenCombobox)}
          currentValue={currentValue}
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-7 mt-5">
        <CurrencyInfo currency={currency} />
        <div className="flex justify-end">
          <ButtonSave isPending={isLoading} handleOnClick={handleSave}
          className="w-1/2" />
        </div>
      </CardContent>
    </Card>
  );
};

interface CurrencyInfoProps {
  currency?: Currency;
}
const CurrencyInfo = ({ currency }: CurrencyInfoProps) => {
  if (!currency) return <></>;
  return (
    <section className="grid grid-cols-[20%_80%] items-center gap-5">
      <FlagIcon code={currency.iso as FlagIconCode} size={80} />
      <div className="grid grid-cols-2">
        <span>Pais</span>
        <span>{currency.countryName}</span>
        <span>Moneda</span>
        <span>{currency.currency}</span>
        <span>Simbolo </span>
        <span>{currency.symbol}</span>
      </div>
    </section>
  );
};
