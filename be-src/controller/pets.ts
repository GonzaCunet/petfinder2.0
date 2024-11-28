import { Sequelize } from "sequelize";
import { cloudinary } from "../lib/cloudinary";
import { User, Auth, Pets } from "./../models/models";
import { index } from "../lib/algolia";
import { Op } from "sequelize";

export async function createPets(
  name: string,
  lastLocation: string,
  photoURL: string,
  lat,
  lng,
  UserId
) {
  try {
    const pets = await Pets.create({
      name,
      lastLocation,
      photoURL,
      status: true,
      lat,
      lng,
      UserId,
    });
    return pets;
  } catch (error) {
    console.log(error);
    if (!error.message) {
      throw new Error("cannot create pets");
    }
    throw error.message;
  }
}
export async function modifyPetData({
  id,
  name,
  lastLocation,
  photoURL,
  lat,
  lng,
}: {
  id: string;
  name: string;
  lastLocation: string;
  photoURL: string;
  lat: string;
  lng: string;
}) {
  try {
    const editPet = await Pets.update(
      {
        name: name,
        lastLocation: lastLocation,
        photoURL: photoURL,
        lat: lat,
        lng: lng,
        status: true,
      },
      { where: { id: id } }
    );
    return editPet;
  } catch (error) {
    console.log(error);
    if (!error.message) {
      throw new Error("no se pudieron modificar los datos de la mascota");
    }
    throw error;
  }
}
export async function getPetById(petId) {
  return await Pets.findByPk(petId);
}
export async function getPetsCreated(UserId) {
  try {
    const findMyCreatedPets = await Pets.findAll({ where: { UserId: UserId } });
    return findMyCreatedPets;
  } catch (error) {
    console.log(error);
    if (!error.message) {
      throw new Error("No se encontraron las mascotas creadas");
    }
  }
}
export async function saveAlgoliaData(petId, lat, lng) {
  const petAlgolia = index.saveObject({
    objectID: petId,
    _geoloc: {
      lat: lat,
      lng: lng,
    },
  });
  return petAlgolia;
}

export async function getPublicIdFromUrl(url) {
  // Encuentra el inicio del public_id después de "upload/"
  const startOfPublicId = url.indexOf("upload/") + "upload/".length;

  // Encuentra la última barra antes de la extensión, que nos marca el final del public_id
  const endOfPublicId = url.lastIndexOf(".");

  // Verifica que ambos índices son válidos
  if (startOfPublicId === -1 || endOfPublicId === -1) {
    throw new Error("URL de imagen de Cloudinary no válida.");
  }
  // Extrae la parte de la URL que corresponde al public_id, que está después de la versión
  let publicId = url.substring(startOfPublicId, endOfPublicId);
  // Si la URL incluye una versión (como v1731114374), la eliminamos
  publicId = publicId.split("/").slice(1).join("/"); // Elimina la versión si está presente

  console.log("publicId extraído:", publicId); // Verifica el valor final de publicId
  return publicId;
}
export async function deletePetPhoto(url) {
  try {
    const publicId = await getPublicIdFromUrl(url);
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error al eliminar la imagen de Cloudinary:", error);
    throw error;
  }
}
export async function deletePetAlgolia(petId) {
  try {
    await index.deleteBy({ filters: `objectID:${petId}` });
  } catch (error) {
    console.log(error);
    if (!error.message) {
      throw new Error("No se pudo eliminar la mascota de algolia");
    }
  }
}
export async function deletePet(petId) {
  try {
    const pets = await Pets.destroy({ where: { id: petId } });
    return pets;
  } catch (error) {
    console.log(error);
    if (!error.message) {
      throw new Error("No se pudo eliminar la mascota de sequelize");
    }
  }
}
export async function searchNearPets(lat, lng): Promise<Pets[]> {
  const search: any = await index.search("", {
    aroundLatLng: `${lat},${lng}`,
    aroundRadius: 10000,
  });
  const pets = search.hits;
  const arrayPetsIds = pets.map((pet) => {
    return pet.objectID;
  });

  const findPets = await Pets.findAll({
    where: {
      id: {
        [Op.in]: arrayPetsIds,
      },
    },
  });
  console.log(findPets);
  return findPets;
}

export async function cloudinaryPhotoUpload(photoURL) {
  if (photoURL) {
    const imagen = await cloudinary.uploader.upload(photoURL, {
      resource_type: "image",
      discard_original_filename: true,
      width: 1000,
    });
    return imagen.secure_url;
  }
}
export async function updateAlgoliaLocation(petId, lat, lng) {
  const modifyPetLocation = await index.partialUpdateObject({
    objectID: petId,
    _geoloc: {
      lat: lat,
      lng: lng,
    },
  });
}
