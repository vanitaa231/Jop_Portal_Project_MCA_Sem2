import * as React from "react"
import PropTypes from "prop-types"
import { cn } from "@/lib/utils" // Ensure cn is defined properly

const Table = React.forwardRef(({ className, children, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props}>
      {children}
    </table>
  </div>
))
Table.displayName = "Table"

Table.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}

const TableHeader = React.forwardRef(({ className, children, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props}>
    {children}
  </thead>
))
TableHeader.displayName = "TableHeader"

TableHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}

const TableBody = React.forwardRef(({ className, children, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props}>
    {children}
  </tbody>
))
TableBody.displayName = "TableBody"

TableBody.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}

const TableFooter = React.forwardRef(({ className, children, ...props }, ref) => (
  <tfoot ref={ref} className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)} {...props}>
    {children}
  </tfoot>
))
TableFooter.displayName = "TableFooter"

TableFooter.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}

const TableRow = React.forwardRef(({ className, children, ...props }, ref) => (
  <tr ref={ref} className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)} {...props}>
    {children}
  </tr>
))
TableRow.displayName = "TableRow"

TableRow.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}

const TableHead = React.forwardRef(({ className, children, ...props }, ref) => (
  <th ref={ref} className={cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", className)} {...props}>
    {children}
  </th>
))
TableHead.displayName = "TableHead"

TableHead.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}

const TableCell = React.forwardRef(({ className, children, ...props }, ref) => (
  <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props}>
    {children}
  </td>
))
TableCell.displayName = "TableCell"

TableCell.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}

const TableCaption = React.forwardRef(({ className, children, ...props }, ref) => (
  <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props}>
    {children}
  </caption>
))
TableCaption.displayName = "TableCaption"

TableCaption.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
