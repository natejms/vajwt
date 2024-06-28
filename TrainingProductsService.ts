import axiosService from "./axiosInstance.ts";
import { UnitOfCompetency } from "../helpers/interface/Student.ts";

export const addQualification = async (qualificationDetails: object, token: string, organisationId: string) => {
  try {
    const response = await axiosService.post(
      '/training-products/addQualification',
      {
        qualificationDetails,
        organisationId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Failed to add qualification');
      return { success: false, message: "Failed to add qualification" };
    }
  } catch (error) {
    console.error('Error adding qualification:', error);
    return { success: false, message: "Error adding qualification" };
  }
};

export const addUnit = async (unitDetails: object, organisationId: string) => {
  try {
    const response = await axiosService.post(
      '/training-products/addUnit',
      {
        unitDetails,
        organisationId
      }
    );
    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Failed to add unit');
      return { success: false, message: "Failed to add unit" };
    }
  } catch (error) {
    console.error('Error adding unit:', error);
    return { success: false, message: "Error adding unit" };
  }
};

export const getTrainingProductsByOrgId = async (organisationId: string, token: string) => {
  try {
    const response = await axiosService.get(`/training-products/getTrainingProductsByOrgId/${organisationId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Failed to fetch qualifications');
      return { success: false, message: "Failed to fetch qualifications" };
    }
    } catch (error) {
      console.error('Error fetching qualifications:', error);
      return { success: false, message: "Error fetching qualifications" };
  }
}

export const getUnitsOfCompetencyByOrgId = async (organisationId: string, token: string) => {
  try {
    const response = await axiosService.get(`/training-products/getUnitsOfCompetencyByOrgId/${organisationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Failed to fetch qualifications');
      return { success: false, message: "Failed to fetch qualifications" };
    }
  } catch (error) {
    console.error('Error fetching qualifications:', error);
    return { success: false, message: "Error fetching qualifications" };
  }
}

export const getQualificationById = async (qualificationId: string, token: string) => {
  try {
    const response = await axiosService.get(`/training-products/getQualificationById/${qualificationId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Failed to fetch qualification');
      return { success: false, message: "Failed to fetch qualification" };
    }
    } catch (error) {
      console.error('Error fetching qualification:', error);
      return { success: false, message: "Error fetching qualification" };
  }
}

export const assignQualificationUnits = async (qualificationId: string, unitIds: UnitOfCompetency[], token: string) => {
  try {
    const response = await axiosService.post('/training-products/assignQualificationUnits',
      {
        qualificationId,
        unitIds
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }});
    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Failed to assign units');
      return { success: false, message: "Failed to assign units" };
    }
  } catch (error) {
    console.error('Error assigning units:', error);
    return { success: false, message: "Error assigning units" };
  }
}
