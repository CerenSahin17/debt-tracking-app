import React from 'react';
import AreaCard from './AreaCard.tsx';
import '../../../style/AreaCards.scss';

interface AreaCardsProps {
  formattedTotalDebt: string;
  formattedTotalPaidAmount: string;
  formattedTotalRemainingDebt: string;
  totalDebt: number;
  totalPaidAmount: number;
  totalRemainingDebt: number;
};

const AreaCards: React.FC<AreaCardsProps> = ({
  formattedTotalDebt,
  formattedTotalPaidAmount,
  formattedTotalRemainingDebt,
  totalDebt,
  totalPaidAmount,
  totalRemainingDebt
}) => {
  return (
    <section className="content-area-cards">
      <AreaCard
        colors={['#e4e8ef', '#475be8']}
        cardInfo={{
          title: 'Toplam Borç',
          value: `₺${formattedTotalDebt}`,
          text: 'Tüm Borçlarınızı görmek için tıklayınız',
        }}
        linkTo="/debts"
      />
      <AreaCard
        colors={['#e4e8ef', '#4ce13f']}
        percentFillValue={totalPaidAmount}
        totalDebtAmount={totalDebt}
        cardInfo={{
          title: 'Toplam Ödenen Tutar',
          value: `₺${formattedTotalPaidAmount}`,
          text: 'Tüm Borçlarınızı görmek için tıklayınız',
        }}
        linkTo="/debts"
      />
      <AreaCard
        colors={['#e4e8ef', '#f29a2e']}
        percentFillValue={totalRemainingDebt}
        totalDebtAmount={totalDebt}
        cardInfo={{
          title: 'Toplam Kalan Borç',
          value: `₺${formattedTotalRemainingDebt}`,
          text: 'Tüm Borçlarınızı görmek için tıklayınız',
        }}
        linkTo="/debts"
      />
    </section>
  );
};
export default AreaCards;
