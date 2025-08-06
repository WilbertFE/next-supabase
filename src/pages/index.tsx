import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import supabase from "@/lib/db";
import type { IMenu } from "@/types/menu";
import Image from "next/image";
import { useEffect, useState } from "react";

const Home = () => {
  const [menus, setMenus] = useState<IMenu[]>([]);

  useEffect(() => {
    const fetchMenus = async () => {
      const { data, error } = await supabase.from("menus").select("*");

      if (error) console.log("error: ", error);
      else setMenus(data);
    };

    fetchMenus();
  }, [supabase]);

  return (
    <div className="container mx-auto py-8">
      <div className="text-3xl font-bold mb-4">Menu</div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {menus.map((menu) => (
          <Card key={menu.id}>
            <CardContent>
              <Image
                src={menu.image}
                alt={menu.name}
                width={200}
                height={200}
                className="w-full h-[30vh] object-cover rounded-lg"
              />
              <div className="flex justify-between mt-4">
                <div>
                  <h4 className="font-semibold text-xl">{menu.name}</h4>
                  <p>{menu.category}</p>
                </div>
                <div className="font-semibold text-2xl">${menu.price}.00</div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full font-bold" size="lg">
                Detail Menu
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
