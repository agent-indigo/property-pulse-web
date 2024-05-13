import type {Metadata} from "next"
import {Property} from "@/interfaces"
import PropertyCard from "@/components/PropertyCard"
import data from "@/properties.json"
export const metadata: Metadata = {
  title: "Properties | PropertyPulse | Find the Perfect Rental",
}
const Properties: React.FC = () => {
  const properties: Property[] = data
  return (
    <section className="px-4 py-6">
      <div className="container-xl lg:container m-auto px-4 py-6">
        {properties.length === 0 ? (
          <p>None found...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((property: Property) => (
              <PropertyCard
                key={property._id}
                _id={property._id}
                images={property.images}
                type={property.type}
                name={property.name}
                beds={property.beds}
                baths={property.baths}
                square_feet={property.square_feet}
                rates={property.rates}
                location={property.location}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
export default Properties