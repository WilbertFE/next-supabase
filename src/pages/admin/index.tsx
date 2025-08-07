import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import supabase from "@/lib/db";
import { IMenu } from "@/types/menu";
import {
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";

const AdminPage = () => {
  const [menus, setMenus] = useState<IMenu[]>([]);
  const [createDialog, setCreateDialog] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<{
    menu: IMenu;
    action: "edit" | "delete";
  } | null>(null);

  useEffect(() => {
    const fetchMenus = async () => {
      const { data, error } = await supabase.from("menus").select("*");

      if (error) console.log("error: ", error);
      else setMenus(data);
    };

    fetchMenus();
  }, [supabase]);

  const handleAddMenu = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const { data, error } = await supabase
        .from("menus")
        .insert(Object.fromEntries(formData))
        .select();
      if (error) console.log("error: ", error);
      else {
        if (data) {
          setMenus((prev) => [...data, ...prev]);
        }
        toast("Menu added successfully");
        setCreateDialog(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteMenu = async () => {
    try {
      const { data, error } = await supabase
        .from("menus")
        .delete()
        .eq("id", selectedMenu?.menu.id);
      if (error) console.log("error: ", error);
      else {
        setMenus((prev) =>
          prev.filter((menu) => menu.id !== selectedMenu?.menu.id)
        );
        toast("Menu deleted successfully");
        setCreateDialog(false);
        setSelectedMenu(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4 flex justify-between w-full">
        <div className="text-3xl font-bold">Menu</div>
        <Dialog open={createDialog} onOpenChange={setCreateDialog}>
          <DialogTrigger asChild>
            <Button className="font-bold">Add Menu</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleAddMenu}>
              <DialogHeader>
                <DialogTitle>Add menu</DialogTitle>
                <DialogDescription>
                  Create a new menu by insert data in this form.
                </DialogDescription>
              </DialogHeader>
              <div className="grid w-full gap-4">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Insert Name"
                    required
                  />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    placeholder="Insert Price"
                    required
                  />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="image">Image</Label>
                  <Input
                    id="image"
                    name="image"
                    placeholder="Insert Image"
                    required
                  />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        <SelectItem value="Coffee">Coffee</SelectItem>
                        <SelectItem value="Non Coffee">Non Coffee</SelectItem>
                        <SelectItem value="Pastries">Pastries</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Insert Description"
                    required
                    className="resize-none h-32"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose>
                  <Button variant="secondary" className="cursor-pointer">
                    Close
                  </Button>
                </DialogClose>
                <DialogClose>
                  <Button type="submit" className="cursor-pointer">
                    Create
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-neutral-700 font-bold">
                Product
              </TableHead>
              <TableHead className="text-neutral-700 font-bold">
                Description
              </TableHead>
              <TableHead className="text-neutral-700 font-bold">
                Category
              </TableHead>
              <TableHead className="text-neutral-700 font-bold">
                Price
              </TableHead>
              <TableHead className="text-neutral-700 font-bold"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menus.map((menu: IMenu) => (
              <TableRow key={menu.id}>
                <TableCell className="flex gap-3 items-center w-full">
                  <Image
                    width={50}
                    height={50}
                    src={menu.image}
                    alt={menu.name}
                    className="aspect-square object-cover rounded-lg"
                  />
                  {menu.name}
                </TableCell>
                <TableCell>
                  {menu.description.split(" ").slice(0, 5).join(" ") + "..."}
                </TableCell>
                <TableCell>{menu.category}</TableCell>
                <TableCell>${menu.price}.00</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="cursor-pointer">
                      <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel className="font-bold">
                        Action
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>Update</DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            setSelectedMenu({ menu, action: "delete" })
                          }
                          className="text-red-400"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog
        open={selectedMenu !== null && selectedMenu.action === "delete"}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedMenu(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete menu</DialogTitle>
            <DialogDescription>
              Are you sure want to delete {selectedMenu?.menu.name}?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose>
              <Button variant="secondary" className="cursor-pointer">
                Close
              </Button>
            </DialogClose>
            <DialogClose>
              <Button
                variant="destructive"
                onClick={handleDeleteMenu}
                className="cursor-pointer"
              >
                Delete
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
