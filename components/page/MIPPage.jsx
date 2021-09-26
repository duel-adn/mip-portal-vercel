import MIPPageFooter from '../footer/MIPPageFooter'
import MIPPageHeader from '../header/MIPResponsiveHeader'

export default function MIPPage(props) {
    const className = `${props.className || ''} mip-page-section`
    return (
        <div className="mip-page-container">
            <MIPPageHeader className="mip-w-100" breadcrumb={props.breadcrumb}
                title={props.title} titleClassName={props.titleClassName}/>
            <main className={className}>
                {props.children}
            </main>
            <MIPPageFooter className="mip-mt-auto mip-w-100"/>
        </div>
    )
}