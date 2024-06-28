import {useEffect, useState} from 'react'
import CBDataTable from "./CBDataTable.tsx";
import { useUserContext } from "../../helpers/OrganisationContext.tsx";
import { TrainingProduct } from "../../helpers/interface/Student.ts";
import { PencilIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../veta-ui/veta-tooltip/veta-tooltip.tsx";
import { toast } from "react-hot-toast";
import VETAToast from "../../veta-ui/veta-toast/veta-toast.tsx";
import VETASkeleton from "../../veta-ui/veta-skeleton/veta-skeleton.tsx";
import { getTrainingProductsByOrgId } from "../../services/TrainingProductsService.ts";
import VETAAlert from "../../veta-ui/veta-alert/veta-alert.tsx";
import { useNavigate } from "react-router-dom";

interface QualificationsTableProps {
  refresh: boolean;
}

export default function QualificationsTable({refresh}: QualificationsTableProps) {
  const token = useUserContext();
  const {organisation} = useUserContext();
  const [loading, setLoading] = useState(false);
  const [trainingProducts, setTrainingProducts] = useState<TrainingProduct[]>([])
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20; // set to 2 for testing
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      if (!organisation?._id || !token) {
        console.warn('Organisation ID or token is missing, skipping fetch.');
        return;
      }

      try {
        const response = await getTrainingProductsByOrgId(organisation._id, token.token || '');
        if (response.success) {
          setLoading(false);
          setTrainingProducts(response.trainingProducts);
          setTotalItems(response.trainingProducts?.length);
        }
      } catch {
        setTrainingProducts([]);
        setTotalItems(0);
        setLoading(false);
        toast.custom((t) => (
          <VETAToast t={t} toastType="danger">
            <>
              There was an error fetching students. If the issue persists, please contact support.
            </>
          </VETAToast>
        ));
      }
    };
    fetchData();
  }, [currentPage, itemsPerPage, organisation?._id, token, refresh]);

  const handleSelectQualification = (qualification: TrainingProduct) => {
    navigate(`/qualifications/${qualification?._id}/units`)
  }
  
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const displayedTrainingProducts = trainingProducts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <>
      <div>
        {loading ? <VETASkeleton/> :
          (trainingProducts.length === 0 ?
              <VETAAlert alertType="warning">
                No qualifications have been added to this organisation yet. Click 'Add Qualification' to get started.
              </VETAAlert> :
              <CBDataTable
                header={<Header />}
                rows={displayedTrainingProducts?.map((trainingProduct) => ({
                  _id: trainingProduct._id,
                  data: <Row trainingProduct={trainingProduct} handleSelectQualification={handleSelectQualification}/>
                }))}
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
          )
        }
      </div>
    </>
  )
}

// Header component to pass into DataTable
const Header = () => {
  return (
    <>
      <th
        scope="col"
        className="w-[15%] py-2.5 pr-3 text-left font-semibold px-4"
      >
        Code
      </th>
      <th
        scope="col"
        className="w-[25%] py-2.5 pr-3 text-left font-semibold px-4"
      >
        Name
      </th>
      <th scope="col" className="relative py-2.5 pr-4 px-4">
        <span className="sr-only">Edit</span>
      </th>
    </>
  )
}

// Row component to pass into DataTable
const Row = ({ trainingProduct, handleSelectQualification }: { trainingProduct: TrainingProduct, handleSelectQualification: (qualification: TrainingProduct) => void }) => {
  return (
    <>
      <td className="whitespace-nowrap py-3 pr-3 text-sm text-primary-text px-4">
        <span className="cursor-pointer hover:underline text-link" onClick={() => handleSelectQualification(trainingProduct)}>
            {trainingProduct.qualificationCode}
        </span>
      </td>
      <td className="whitespace-nowrap py-3 pr-3 text-sm text-primary-text px-4">
        <span className="cursor-pointer hover:underline text-link" onClick={() => handleSelectQualification(trainingProduct)}>
            {trainingProduct.qualificationName}
        </span>
      </td>
      <td
        className="flex justify-end items-center gap-4 whitespace-nowrap py-3 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-neutral-500 hover:text-primary/90" onClick={() => handleSelectQualification(trainingProduct)}>
              <PencilIcon className="size-4" />
              <span className="sr-only">, {trainingProduct._id}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            Update
          </TooltipContent>
        </Tooltip>
      </td>
    </>
  );
};
